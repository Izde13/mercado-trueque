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
import type { UserRepository } from '../../domain/repositories/user.repository';
import { EstadoEnvio } from '../../domain/entities/envio.entity';
import { EstadoIntercambio } from '../../domain/entities/intercambio.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class DeliverTradeUseCase {
  constructor(
    private readonly deliveryValidator: DeliveryPhaseValidator,
    private readonly notificationService: NotificationService,
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
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: DeliverTradeDto): Promise<DeliveryResponseDto> {
    if (!input.intercambio_id) {
      throw new BadRequestException('El ID del intercambio es requerido');
    }

    const intercambioId = input.intercambio_id as string;

    const intercambio = await this.intercambioRepository.findById(
      intercambioId,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    const propuesta = await this.tradeProposalRepository.findByIdWithRelations(
      intercambio.propuestaId,
    );

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    const productosAMarcar: string[] = [];

    if (input.usuario_id === propuesta.usuarioOferenteId) {
      const productosOfrecidos =
        await this.productoPropuestaRepository.findByPropuestaId(
          intercambio.propuestaId,
        );
      productosAMarcar.push(...productosOfrecidos.map((p) => p.productoId));
    } else {
      const productoSolicitado = await this.productRepository.findById(
        propuesta.productoSolicitadoId,
      );
      if (!productoSolicitado) {
        throw new NotFoundException('Producto solicitado no encontrado');
      }
      if (input.usuario_id === productoSolicitado.usuarioId) {
        productosAMarcar.push(propuesta.productoSolicitadoId);
      } else {
        throw new BadRequestException(
          'El usuario no está involucrado en este intercambio',
        );
      }
    }

    const context: DeliveryContext = {
      userId: input.usuario_id,
      userStatus: 'activo',
      userRating: 0,
      userTotalTrades: 0,
      timestamp: new Date(),
      intercambioId: intercambioId,
      productoId: '',
      deliveryAddress: input.delivery_address,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const validation = await this.deliveryValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    const todosLosEnvios = await this.envioRepository.findByIntercambioId(
      intercambioId,
    );

    for (const productoId of productosAMarcar) {
      const envio = todosLosEnvios.find((e) => e.productoId === productoId);
      if (envio) {
        const envioEntregado = envio.cambiarEstado(EstadoEnvio.ENTREGADO);
        await this.envioRepository.update(envioEntregado);
      }
    }

    const enviosActualizados = await this.envioRepository.findByIntercambioId(
      input.intercambio_id,
    );

    const productosOfrecidos =
      await this.productoPropuestaRepository.findByPropuestaId(
        intercambio.propuestaId,
      );

    const enviosOferente = enviosActualizados.filter((e) =>
      productosOfrecidos.some((pp) => pp.productoId === e.productoId),
    );
    const oferenteCompletó =
      enviosOferente.length === productosOfrecidos.length &&
      enviosOferente.every((e) => e.estadoEnvio === EstadoEnvio.ENTREGADO);

    const productoSolicitado = await this.productRepository.findById(
      propuesta.productoSolicitadoId,
    );

    if (!productoSolicitado) {
      throw new NotFoundException('Producto solicitado no encontrado');
    }

    const envioReceptor = enviosActualizados.find(
      (e) => e.productoId === propuesta.productoSolicitadoId,
    );
    const receptorCompletó =
      envioReceptor && envioReceptor.estadoEnvio === EstadoEnvio.ENTREGADO;

    let estado = intercambio.estado;
    if (oferenteCompletó && receptorCompletó) {
      const intercambioActualizado = intercambio.cambiarEstado(
        EstadoIntercambio.COMPLETADO,
      );
      await this.intercambioRepository.update(intercambioActualizado);
      estado = EstadoIntercambio.COMPLETADO;

      try {
        const oferente = await this.userRepository.findById(
          propuesta.usuarioOferenteId,
        );
        const receptor = await this.userRepository.findById(
          productoSolicitado.usuarioId,
        );

        if (oferente && receptor) {
          const offerentFullName = (
            oferente.nombre +
            ' ' +
            oferente.apellido
          ).trim();
          const receptorFullName = (
            receptor.nombre +
            ' ' +
            receptor.apellido
          ).trim();

          await this.notificationService.notifyTradeCompleted(
            oferente.id,
            receptor.id,
            intercambio.id,
            offerentFullName,
            receptorFullName,
          );
        }
      } catch (error) {
        console.error('Error creating trade completed notifications:', error);
      }
    }

    return {
      id: intercambio.id,
      intercambio_id: intercambio.id,
      estado: estado,
      fecha_completado: new Date(),
    };
  }
}
