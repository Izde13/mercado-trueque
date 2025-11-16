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
import type { UserRepository } from '../../domain/repositories/user.repository';
import { Envio, EstadoEnvio } from '../../domain/entities/envio.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ShipTradeUseCase {
  constructor(
    private readonly shippingValidator: ShippingPhaseValidator,
    private readonly notificationService: NotificationService,
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
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ShipTradeDto): Promise<ShippingResponseDto[]> {
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    const context: ShippingContext = {
      userId: '',
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

    const validation = await this.shippingValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    const propuesta = await this.tradeProposalRepository.findByIdWithRelations(
      intercambio.propuestaId,
    );

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    const productoSolicitado = await this.productRepository.findById(
      propuesta.productoSolicitadoId,
    );

    if (!productoSolicitado) {
      throw new NotFoundException('Producto solicitado no encontrado');
    }

    const oferente = await this.userRepository.findById(
      propuesta.usuarioOferenteId,
    );
    const receptor = await this.userRepository.findById(
      productoSolicitado.usuarioId,
    );

    const envios: ShippingResponseDto[] = [];
    const productosAEnviar: string[] = [];

    if (input.usuario_id === propuesta.usuarioOferenteId) {
      const productosOfrecidos =
        await this.productoPropuestaRepository.findByPropuestaId(
          intercambio.propuestaId,
        );
      productosAEnviar.push(...productosOfrecidos.map((p) => p.productoId));
    } else if (input.usuario_id === productoSolicitado.usuarioId) {
      productosAEnviar.push(propuesta.productoSolicitadoId);
    } else {
      throw new BadRequestException(
        'El usuario no está involucrado en este intercambio',
      );
    }

    for (const productoId of productosAEnviar) {
      const envio = Envio.create(
        intercambio.id,
        productoId,
        input.origen_direccion,
      );

      const uuid = uuidv4();
      let savedEnvio = envio.asignarTracking(
        'TRK-' + uuid.substring(0, 8).toUpperCase(),
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

    for (const envio of envios) {
      const envioActualizado = await this.envioRepository.findById(envio.id);
      if (envioActualizado) {
        const envioConEstado = envioActualizado.cambiarEstado(
          EstadoEnvio.RECIBIDO_CENTRO,
        );
        await this.envioRepository.update(envioConEstado);
      }
    }

    const todosLosEnvios = await this.envioRepository.findByIntercambioId(
      intercambio.id,
    );

    const productosOfrecidos =
      await this.productoPropuestaRepository.findByPropuestaId(
        intercambio.propuestaId,
      );

    const enviosOferente = todosLosEnvios.filter((e) =>
      productosOfrecidos.some((pp) => pp.productoId === e.productoId),
    );
    const oferenteCompletó =
      enviosOferente.length === productosOfrecidos.length &&
      enviosOferente.every(
        (e) => e.estadoEnvio === EstadoEnvio.RECIBIDO_CENTRO,
      );

    const envioReceptor = todosLosEnvios.find(
      (e) => e.productoId === propuesta.productoSolicitadoId,
    );
    const receptorCompletó =
      envioReceptor &&
      envioReceptor.estadoEnvio === EstadoEnvio.RECIBIDO_CENTRO;

    if (oferenteCompletó && receptorCompletó) {
      const intercambioActualizado = intercambio.cambiarEstado(
        'productos_enviados' as any,
      );
      await this.intercambioRepository.update(intercambioActualizado);

      try {
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

          await this.notificationService.notifyBothConfirmedShipment(
            oferente.id,
            receptor.id,
            intercambio.id,
            offerentFullName,
            receptorFullName,
          );
        }
      } catch (error) {
        console.error('Error creating shipment notifications:', error);
      }
    }

    return envios;
  }
}
