import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { DeliveryContext } from '../delivery-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 5.4: Confirmación de entrega dentro de 5 días
 */
@Injectable()
export class DeliveryConfirmationRule
  implements ISpecification<DeliveryContext>
{
  async isSatisfiedBy(context: DeliveryContext): Promise<SpecificationResult> {
    if (!context.estimatedDeliveryDate) {
      return SpecificationResult.warning(
        'Asegúrate de confirmar la recepción del producto dentro de 5 días',
      );
    }

    const daysUntilDeadline = Math.floor(
      (context.estimatedDeliveryDate.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysUntilDeadline < 0) {
      return SpecificationResult.warning(
        'La fecha de entrega ha pasado. Confirma la recepción del producto',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<DeliveryContext>): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<DeliveryContext>): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }
}
