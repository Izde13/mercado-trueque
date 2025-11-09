import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { AcceptanceContext } from '../acceptance-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 2.6: Centro de distribución disponible para el intercambio
 *
 * Verifica que existe un centro de distribución asignado para el intercambio.
 * El contexto de dominio proporciona esta información.
 */
@Injectable()
export class DistributionCenterAvailableRule
  implements ISpecification<AcceptanceContext>
{
  constructor() {}

  async isSatisfiedBy(
    context: AcceptanceContext,
  ): Promise<SpecificationResult> {
    // Verifica que existe un centro de distribución asociado al intercambio
    if (!context.intercambio?.centroDistribucionId) {
      return SpecificationResult.failure(
        'No hay un centro de distribución disponible para este intercambio',
      );
    }

    return SpecificationResult.success();
  }

  and(
    other: ISpecification<AcceptanceContext>,
  ): ISpecification<AcceptanceContext> {
    throw new Error('No implementado');
  }

  or(
    other: ISpecification<AcceptanceContext>,
  ): ISpecification<AcceptanceContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<AcceptanceContext> {
    throw new Error('No implementado');
  }
}
