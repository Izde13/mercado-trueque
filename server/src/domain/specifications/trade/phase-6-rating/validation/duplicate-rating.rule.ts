import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { RatingContext } from '../rating-context';
import { ISpecification } from '../../../base/specification.interface';
import type { ReviewRepository } from '../../../../repositories/review.repository';

/**
 * VALIDACIÓN 6.5: Evitar calificaciones duplicadas
 *
 * ARQUITECTURA:
 * - Depende de interfaz ReviewRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class DuplicateRatingRule implements ISpecification<RatingContext> {
  constructor(
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async isSatisfiedBy(context: RatingContext): Promise<SpecificationResult> {
    // Verificar que no exista una calificación previa del mismo usuario al mismo usuario
    const exists = await this.reviewRepository.existsRating(
      context.intercambioId,
      context.userId,
      context.ratedUserId,
    );

    if (exists) {
      return SpecificationResult.failure(
        'Ya has calificado a este usuario en este intercambio',
        'DUPLICATE_RATING',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<RatingContext>): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<RatingContext>): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }
}
