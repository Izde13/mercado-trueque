import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { DeliveryPhaseValidator } from '../../domain/specifications/trade/phase-5-delivery/delivery-phase.validator';
import { DeliveryContext } from '../../domain/specifications/trade/phase-5-delivery/delivery-context';
import {
  DeliverTradeDto,
  DeliveryResponseDto,
} from '../dtos/deliver-trade.dto';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { RevisionProductoRepository } from '../../domain/repositories/revision-producto.repository';
import type { EnvioRepository } from '../../domain/repositories/envio.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { EstadoEnvio } from '../../domain/entities/envio.entity';
import { EstadoIntercambio } from '../../domain/entities/intercambio.entity';

@Injectable()
export class DeliverTradeUseCase {
  constructor(
    private readonly deliveryValidator: DeliveryPhaseValidator,
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('RevisionProductoRepository')
    private readonly revisionProductoRepository: RevisionProductoRepository,
    @Inject('EnvioRepository')
    private readonly envioRepository: EnvioRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: DeliverTradeDto): Promise<DeliveryResponseDto> {
    // 1. Obtener intercambio
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    // 2. Obtener propuesta
    const propuesta = await this.tradeProposalRepository.findByIdWithRelations(
      intercambio.propuestaId,
    );

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    // 3. Obtener producto solicitado para identificar al receptor
    const productoSolicitado = await this.productRepository.findById(
      propuesta.productoSolicitadoId,
    );

    if (!productoSolicitado) {
      throw new NotFoundException('Producto solicitado no encontrado');
    }

    // 4. Obtener productos ofrecidos por el OFERENTE
    const productosOfrecidos =
      await this.productoPropuestaRepository.findByPropuestaId(
        intercambio.propuestaId,
      );

    // 5. Determinar qué productos debe marcar como entregado el usuario actual
    const productosAMarcar: string[] = [];

    // Si el usuario es el OFERENTE (Juan) - marca sus productos como entregados
    if (input.usuario_id === propuesta.usuarioOferenteId) {
      productosAMarcar.push(...productosOfrecidos.map((p) => p.productoId));
    }
    // Si el usuario es el RECEPTOR (María) - marca el producto solicitado como entregado
    else if (input.usuario_id === productoSolicitado.usuarioId) {
      productosAMarcar.push(propuesta.productoSolicitadoId);
    } else {
      throw new BadRequestException(
        'El usuario no está involucrado en este intercambio',
      );
    }

    // 6. Crear contexto para validación
    const context: DeliveryContext = {
      userId: input.usuario_id,
      userStatus: 'activo',
      userRating: 0,
      userTotalTrades: 0,
      timestamp: new Date(),
      intercambioId: input.intercambio_id,
      productoId: '', // No es requerido para esta validación
      deliveryAddress: input.delivery_address,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    // 7. Validar entrega
    const validation = await this.deliveryValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 8. Obtener todos los envios del intercambio
    const todosLosEnvios = await this.envioRepository.findByIntercambioId(
      input.intercambio_id,
    );

    // 9. Marcar como ENTREGADO solo los envios del usuario actual
    for (const productoId of productosAMarcar) {
      const envio = todosLosEnvios.find((e) => e.productoId === productoId);
      if (envio) {
        const envioEntregado = envio.cambiarEstado(EstadoEnvio.ENTREGADO);
        await this.envioRepository.update(envioEntregado);
      }
    }

    // 10. Verificar si ambos usuarios completaron sus entregas
    const enviosActualizados = await this.envioRepository.findByIntercambioId(
      input.intercambio_id,
    );

    // Verificar si el OFERENTE (Juan) entregó TODOS sus productos
    const enviosOferente = enviosActualizados.filter((e) =>
      productosOfrecidos.some((pp) => pp.productoId === e.productoId),
    );
    const oferenteCompletó =
      enviosOferente.length === productosOfrecidos.length &&
      enviosOferente.every((e) => e.estadoEnvio === EstadoEnvio.ENTREGADO);

    // Verificar si el RECEPTOR (María) entregó su producto
    const envioReceptor = enviosActualizados.find(
      (e) => e.productoId === propuesta.productoSolicitadoId,
    );
    const receptorCompletó =
      envioReceptor && envioReceptor.estadoEnvio === EstadoEnvio.ENTREGADO;

    // 11. Solo cambiar estado a COMPLETADO si AMBOS completaron
    let estado = intercambio.estado;
    if (oferenteCompletó && receptorCompletó) {
      const intercambioActualizado = intercambio.cambiarEstado(
        EstadoIntercambio.COMPLETADO,
      );
      await this.intercambioRepository.update(intercambioActualizado);
      estado = EstadoIntercambio.COMPLETADO;
    }

    return {
      id: intercambio.id,
      intercambio_id: intercambio.id,
      estado: estado,
      fecha_completado: new Date(),
    };
  }
}
