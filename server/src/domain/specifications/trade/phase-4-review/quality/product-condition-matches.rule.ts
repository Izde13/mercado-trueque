import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ReviewContext } from '../review-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 4.2: Condición del producto válida
 * Calificación debe ser >= 3 para aceptar
 */
@Injectable()
export class ProductConditionMatchesRule
  implements ISpecification<ReviewContext>
{
  async isSatisfiedBy(context: ReviewContext): Promise<SpecificationResult> {
    if (context.conditionRating < 1 || context.conditionRating > 5) {
      return SpecificationResult.failure(
        'Calificación debe estar entre 1 y 5 estrellas',
        'INVALID_CONDITION_RATING',
      );
    }

    if (context.conditionRating < 3) {
      return SpecificationResult.failure(
        `El producto tiene condición inaceptable (${context.conditionRating} estrellas). Se iniciará proceso de devolución.`,
        'PRODUCT_CONDITION_UNACCEPTABLE',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<ReviewContext>): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ReviewContext>): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }
}
