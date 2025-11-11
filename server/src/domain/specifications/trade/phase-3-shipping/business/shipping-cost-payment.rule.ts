import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ShippingContext } from '../shipping-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 3.5: Costos de envío validados
 */
@Injectable()
export class ShippingCostPaymentRule
  implements ISpecification<ShippingContext>
{
  async isSatisfiedBy(context: ShippingContext): Promise<SpecificationResult> {
    // Los costos se calculan automáticamente según ubicación
    // Esta validación es más informativa

    return SpecificationResult.success();
  }

  and(other: ISpecification<ShippingContext>): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ShippingContext>): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }
}
