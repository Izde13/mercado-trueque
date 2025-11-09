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
import {
  RevisionProducto,
  EstadoRevision,
} from '../../domain/entities/revision-producto.entity';
import { EstadoIntercambio } from '../../domain/entities/intercambio.entity';

@Injectable()
export class ReviewTradeUseCase {
  constructor(
    private readonly reviewValidator: ReviewPhaseValidator,
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
  ) {}

  async execute(input: ReviewProductDto): Promise<ReviewResponseDto> {
    // 1. Obtener intercambio
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    // 2. Obtener producto
    const producto = await this.productRepository.findById(input.producto_id);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 3. Obtener envío
    const envios = await this.envioRepository.findByIntercambioId(
      input.intercambio_id,
    );
    const envio = envios.find((e) => e.productoId === input.producto_id);
    if (!envio) {
      throw new NotFoundException('Envío no encontrado');
    }

    // 4. Crear contexto para validación
    const context: ReviewContext = {
      userId: '', // Será el centro distribución
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

    // 5. Validar revisión
    const validation = await this.reviewValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 6. Crear registro de revisión
    const revision = RevisionProducto.create(
      input.intercambio_id,
      input.producto_id,
    );

    // Aprobar o rechazar basado en rating
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

    // 7. Validar estado del intercambio según revisiones de ambos usuarios
    if (input.condition_rating < 3) {
      // Si está rechazado, cambiar estado del intercambio a RECHAZADO_REVISION
      const intercambioActualizado = intercambio.cambiarEstado(
        EstadoIntercambio.RECHAZADO_REVISION,
      );
      await this.intercambioRepository.update(intercambioActualizado);
    } else {
      // Si está aprobado, verificar si AMBOS usuarios completaron sus revisiones
      // Obtener propuesta
      const propuesta =
        await this.tradeProposalRepository.findByIdWithRelations(
          intercambio.propuestaId,
        );

      if (!propuesta) {
        throw new NotFoundException('Propuesta no encontrada');
      }

      // Obtener productos ofrecidos por el OFERENTE (Juan)
      const productosOfrecidos =
        await this.productoPropuestaRepository.findByPropuestaId(
          intercambio.propuestaId,
        );

      // Obtener todas las revisiones del intercambio
      const todasLasRevisiones =
        await this.revisionProductoRepository.findByIntercambioId(
          input.intercambio_id,
        );

      // Verificar si el OFERENTE (Juan) ha revisado TODOS sus productos y están APROBADOS
      const revisionesOferente = todasLasRevisiones.filter((r) =>
        productosOfrecidos.some((pp) => pp.productoId === r.productoId),
      );
      const oferenteCompletó =
        revisionesOferente.length === productosOfrecidos.length &&
        revisionesOferente.every(
          (r) => r.estadoRevision === EstadoRevision.APROBADO,
        );

      // Verificar si el RECEPTOR (María) ha revisado su producto y está APROBADO
      const revisionReceptor = todasLasRevisiones.find(
        (r) => r.productoId === propuesta.productoSolicitadoId,
      );
      const receptorCompletó =
        revisionReceptor &&
        revisionReceptor.estadoRevision === EstadoRevision.APROBADO;

      // Solo cambiar estado a EN_REVISION si AMBOS completaron sus revisiones
      if (oferenteCompletó && receptorCompletó) {
        const intercambioActualizado = intercambio.cambiarEstado(
          EstadoIntercambio.EN_REVISION,
        );
        await this.intercambioRepository.update(intercambioActualizado);
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
