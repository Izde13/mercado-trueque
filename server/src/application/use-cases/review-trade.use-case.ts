import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ReviewPhaseValidator } from '../../domain/specifications/trade/phase-4-review/review-phase.validator';
import { ReviewContext } from '../../domain/specifications/trade/phase-4-review/review-context';
import { ReviewProductDto, ReviewResponseDto } from '../dtos/review-trade.dto';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { EnvioRepository } from '../../domain/repositories/envio.repository';
import type { RevisionProductoRepository } from '../../domain/repositories/revision-producto.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import {
  RevisionProducto,
  EstadoRevision,
} from '../../domain/entities/revision-producto.entity';
import { EstadoIntercambio } from '../../domain/entities/intercambio.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ReviewTradeUseCase {
  constructor(
    private readonly reviewValidator: ReviewPhaseValidator,
    private readonly notificationService: NotificationService,
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('EnvioRepository')
    private readonly envioRepository: EnvioRepository,
    @Inject('RevisionProductoRepository')
    private readonly revisionProductoRepository: RevisionProductoRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ReviewProductDto): Promise<ReviewResponseDto> {
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    const producto = await this.productRepository.findById(input.producto_id);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const envios = await this.envioRepository.findByIntercambioId(
      input.intercambio_id,
    );
    const envio = envios.find((e) => e.productoId === input.producto_id);
    if (!envio) {
      throw new NotFoundException('Envío no encontrado');
    }

    const context: ReviewContext = {
      userId: '',
      userStatus: 'activo',
      userRating: 0,
      userTotalTrades: 0,
      timestamp: new Date(),
      intercambioId: input.intercambio_id,
      productoId: input.producto_id,
      conditionRating: input.condition_rating,
      observations: input.observations,
      photos: input.photos,
    };

    const validation = await this.reviewValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    const revision = RevisionProducto.create(
      input.intercambio_id,
      input.producto_id,
    );

    let savedRevision: RevisionProducto;
    if (input.condition_rating >= 3) {
      const revisionAprobada = revision.aprobar(
        'sistema',
        input.condition_rating,
      );
      savedRevision =
        await this.revisionProductoRepository.save(revisionAprobada);
    } else {
      const revisionRechazada = revision.rechazar(
        'sistema',
        input.observations || 'Condición no satisfactoria',
      );
      savedRevision =
        await this.revisionProductoRepository.save(revisionRechazada);
    }

    if (input.condition_rating < 3) {
      const intercambioActualizado = intercambio.cambiarEstado(
        EstadoIntercambio.RECHAZADO_REVISION,
      );
      await this.intercambioRepository.update(intercambioActualizado);
    } else {
      const propuesta =
        await this.tradeProposalRepository.findByIdWithRelations(
          intercambio.propuestaId,
        );

      if (!propuesta) {
        throw new NotFoundException('Propuesta no encontrada');
      }

      const productosOfrecidos =
        await this.productoPropuestaRepository.findByPropuestaId(
          intercambio.propuestaId,
        );

      const todasLasRevisiones =
        await this.revisionProductoRepository.findByIntercambioId(
          input.intercambio_id,
        );

      const revisionesOferente = todasLasRevisiones.filter((r) =>
        productosOfrecidos.some((pp) => pp.productoId === r.productoId),
      );
      const oferenteCompletó =
        revisionesOferente.length === productosOfrecidos.length &&
        revisionesOferente.every(
          (r) => r.estadoRevision === EstadoRevision.APROBADO,
        );

      const revisionReceptor = todasLasRevisiones.find(
        (r) => r.productoId === propuesta.productoSolicitadoId,
      );
      const receptorCompletó =
        revisionReceptor &&
        revisionReceptor.estadoRevision === EstadoRevision.APROBADO;

      if (oferenteCompletó && receptorCompletó) {
        const intercambioActualizado = intercambio.cambiarEstado(
          EstadoIntercambio.EN_REVISION,
        );
        await this.intercambioRepository.update(intercambioActualizado);

        try {
          const productoSolicitado = await this.productRepository.findById(
            propuesta.productoSolicitadoId,
          );
          const oferente = await this.userRepository.findById(
            propuesta.usuarioOferenteId,
          );
          const receptor = productoSolicitado
            ? await this.userRepository.findById(productoSolicitado.usuarioId)
            : null;

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

            await this.notificationService.notifyReviewCompleted(
              oferente.id,
              receptor.id,
              intercambio.id,
              offerentFullName,
              receptorFullName,
            );
          }
        } catch (error) {
          console.error('Error creating review notifications:', error);
        }
      }
    }

    return {
      id: savedRevision.id,
      intercambio_id: savedRevision.intercambioId,
      producto_id: savedRevision.productoId,
      calificacion_producto: savedRevision.calificacionEstado ?? undefined,
      estado_revision: savedRevision.estadoRevision ?? 'aprobado',
      fecha_revision: savedRevision.fechaRevision ?? new Date(),
    };
  }
}
