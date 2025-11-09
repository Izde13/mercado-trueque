import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ReviewContext } from '../review-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 4.5: Si hay daño, documentar observaciones
 */
@Injectable()
export class ObservationsIfDamagedRule
  implements ISpecification<ReviewContext>
{
  async isSatisfiedBy(context: ReviewContext): Promise<SpecificationResult> {
    // Si calificación < 4, observaciones son obligatorias
    if (context.conditionRating < 4) {
      if (!context.observations || context.observations.trim().length === 0) {
        return SpecificationResult.failure(
          'Debes documentar los daños/problemas observados en el producto',
          'OBSERVATIONS_REQUIRED',
        );
      }

      if (context.observations.length < 20) {
        return SpecificationResult.failure(
          'Las observaciones deben tener al menos 20 caracteres',
          'OBSERVATIONS_TOO_SHORT',
        );
      }
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
