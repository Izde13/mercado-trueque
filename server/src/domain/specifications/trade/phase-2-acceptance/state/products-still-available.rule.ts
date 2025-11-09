import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { AcceptanceContext } from '../acceptance-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 2.5: Los productos ofrecidos siguen siendo válidos
 *
 * Verifica que los productos ofrecidos en la propuesta siguen siendo válidos:
 * - Ambos grupos de productos deben existir y estar activos
 * - Basado en información disponible en el contexto de dominio
 */
@Injectable()
export class ProductsStillAvailableRule
  implements ISpecification<AcceptanceContext>
{
  constructor() {}

  async isSatisfiedBy(
    context: AcceptanceContext,
  ): Promise<SpecificationResult> {
    // Verifica si los productos en el contexto están activos
    if (!context.products?.allActive) {
      return SpecificationResult.failure(
        'Los productos en esta propuesta no están todos disponibles',
      );
    }

    // Verifica que haya productos en ambos lados de la propuesta
    if (
      !context.products?.offeredCount ||
      context.products.offeredCount === 0
    ) {
      return SpecificationResult.failure(
        'La propuesta debe tener productos ofrecidos',
      );
    }

    if (
      !context.products?.requestedCount ||
      context.products.requestedCount === 0
    ) {
      return SpecificationResult.failure(
        'La propuesta debe tener productos solicitados',
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
