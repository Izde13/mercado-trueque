import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.4: Reputación mínima para proponer
 *
 * Regla de negocio: El usuario debe tener una calificación mínima de 1.5 estrellas
 * para poder hacer propuestas de trueque. Esto:
 * - Previene spam de cuentas nuevas/problemáticas
 * - Incentiva comportamiento ético
 * - Protege a otros usuarios de intercambios con cuentas de riesgo
 */
@Injectable()
export class MinimumRatingRule implements ISpecification<ProposalContext> {
  private readonly MINIMUM_RATING = 1.5;

  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    const userRating = context.offerent.calificacionPromedio || 0;

    if (userRating < this.MINIMUM_RATING) {
      return SpecificationResult.failure(
        `Tu reputación actual (${userRating.toFixed(1)} ⭐) es baja. Debes tener al menos ${this.MINIMUM_RATING} ⭐ para hacer propuestas de trueque. Completa intercambios exitosos para mejorar tu reputación.`,
        'LOW_REPUTATION',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('Composición no implementada');
  }

  or(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('Composición no implementada');
  }

  not(): ISpecification<ProposalContext> {
    throw new Error('Composición no implementada');
  }
}
