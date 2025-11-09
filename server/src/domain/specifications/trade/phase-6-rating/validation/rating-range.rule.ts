import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { RatingContext } from '../rating-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 6.3: Validar rango de calificación
 */
@Injectable()
export class RatingRangeRule implements ISpecification<RatingContext> {
  async isSatisfiedBy(context: RatingContext): Promise<SpecificationResult> {
    if (context.userRating < 1 || context.userRating > 5) {
      return SpecificationResult.failure(
        'Calificación del usuario debe estar entre 1 y 5 estrellas',
        'INVALID_USER_RATING',
      );
    }

    if (context.productRating < 1 || context.productRating > 5) {
      return SpecificationResult.failure(
        'Calificación del producto debe estar entre 1 y 5 estrellas',
        'INVALID_PRODUCT_RATING',
      );
    }

    if (
      context.communicationRating &&
      (context.communicationRating < 1 || context.communicationRating > 5)
    ) {
      return SpecificationResult.failure(
        'Calificación de comunicación debe estar entre 1 y 5 estrellas',
        'INVALID_COMMUNICATION_RATING',
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
