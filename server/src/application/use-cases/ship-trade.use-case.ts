import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ShippingPhaseValidator } from '../../domain/specifications/trade/phase-3-shipping/shipping-phase.validator';
import { ShippingContext } from '../../domain/specifications/trade/phase-3-shipping/shipping-context';
import { ShipTradeDto, ShippingResponseDto } from '../dtos/ship-trade.dto';
import { v4 as uuidv4 } from 'uuid';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { EnvioRepository } from '../../domain/repositories/envio.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Envio, EstadoEnvio } from '../../domain/entities/envio.entity';

@Injectable()
export class ShipTradeUseCase {
  constructor(
    private readonly shippingValidator: ShippingPhaseValidator,
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('EnvioRepository')
    private readonly envioRepository: EnvioRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: ShipTradeDto): Promise<ShippingResponseDto[]> {
    // 1. Obtener intercambio
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    // 2. Crear contexto para validación
    const context: ShippingContext = {
      userId: '', // Se obtiene de la propuesta
      userStatus: 'activo',
      userRating: 0,
      userTotalTrades: 0,
      timestamp: new Date(),
      intercambioId: intercambio.id,
      intercambio: {
        id: intercambio.id,
        estado: intercambio.estado ?? 'aceptada',
        createdAt: intercambio.fechaInicio ?? new Date(),
      },
      shippingAddresses: {
        origin: input.origen_direccion,
        destination: input.destino_direccion,
      },
    };

    // 3. Validar envío
    const validation = await this.shippingValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 4. Obtener propuesta con productos
    const propuesta = await this.tradeProposalRepository.findByIdWithRelations(
      intercambio.propuestaId,
    );

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    // 5. Obtener producto solicitado para saber quién es el receptor
    const productoSolicitado = await this.productRepository.findById(
      propuesta.productoSolicitadoId,
    );

    if (!productoSolicitado) {
      throw new NotFoundException('Producto solicitado no encontrado');
    }

    // 6. Determinar qué productos debe enviar el usuario actual
    const envios: ShippingResponseDto[] = [];
    const productosAEnviar: string[] = [];

    // Si el usuario es el OFERENTE (Juan) - envía sus productos ofrecidos
    if (input.usuario_id === propuesta.usuarioOferenteId) {
      const productosOfrecidos =
        await this.productoPropuestaRepository.findByPropuestaId(
          intercambio.propuestaId,
        );
      productosAEnviar.push(...productosOfrecidos.map((p) => p.productoId));
    }
    // Si el usuario es el RECEPTOR (María) - envía el producto solicitado
    else if (input.usuario_id === productoSolicitado.usuarioId) {
      productosAEnviar.push(propuesta.productoSolicitadoId);
    } else {
      throw new BadRequestException(
        'El usuario no está involucrado en este intercambio',
      );
    }

    // 7. Crear envíos para los productos del usuario actual
    for (const productoId of productosAEnviar) {
      const envio = Envio.create(
        intercambio.id,
        productoId,
        input.origen_direccion, // Dirección del usuario actual
      );

      let savedEnvio = envio.asignarTracking(
        `TRK-${uuidv4().substring(0, 8).toUpperCase()}`,
        'default',
      );

      savedEnvio = await this.envioRepository.save(savedEnvio);

      envios.push({
        id: savedEnvio.id,
        intercambio_id: savedEnvio.intercambioId,
        producto_id: savedEnvio.productoId,
        estado: savedEnvio.estadoEnvio ?? 'pendiente_envio',
        codigo_rastreo: savedEnvio.codigoTracking ?? undefined,
        origen_direccion: input.origen_direccion,
        destino_direccion: savedEnvio.direccionOrigen,
        fecha_envio: savedEnvio.fechaEnvio ?? new Date(),
        fecha_entrega_estimada: undefined,
      });
    }

    // 8. Actualizar los envíos creados por el usuario actual a recibido_centro
    for (const envio of envios) {
      const envioActualizado = await this.envioRepository.findById(envio.id);
      if (envioActualizado) {
        const envioConEstado = envioActualizado.cambiarEstado(
          EstadoEnvio.RECIBIDO_CENTRO,
        );
        await this.envioRepository.update(envioConEstado);
      }
    }

    // 9. Verificar si ambos usuarios completaron sus envíos
    const todosLosEnvios = await this.envioRepository.findByIntercambioId(
      intercambio.id,
    );

    // Obtener los productos ofrecidos por el OFERENTE
    const productosOfrecidos =
      await this.productoPropuestaRepository.findByPropuestaId(
        intercambio.propuestaId,
      );

    // Verificar si el OFERENTE (Juan) ya envió TODOS sus productos
    const enviosOferente = todosLosEnvios.filter((e) =>
      productosOfrecidos.some((pp) => pp.productoId === e.productoId),
    );
    const oferenteCompletó =
      enviosOferente.length === productosOfrecidos.length &&
      enviosOferente.every(
        (e) => e.estadoEnvio === EstadoEnvio.RECIBIDO_CENTRO,
      );

    // Verificar si el RECEPTOR (María) ya envió su producto
    const envioReceptor = todosLosEnvios.find(
      (e) => e.productoId === propuesta.productoSolicitadoId,
    );
    const receptorCompletó =
      envioReceptor &&
      envioReceptor.estadoEnvio === EstadoEnvio.RECIBIDO_CENTRO;

    // Solo cambiar estado si AMBOS completaron sus envíos
    if (oferenteCompletó && receptorCompletó) {
      const intercambioActualizado = intercambio.cambiarEstado(
        'productos_enviados' as any,
      );
      await this.intercambioRepository.update(intercambioActualizado);
    }

    return envios;
  }
}
