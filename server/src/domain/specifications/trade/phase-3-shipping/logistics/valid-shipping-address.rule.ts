import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ShippingContext } from '../shipping-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 3.2: Direcciones de envío válidas
 */
@Injectable()
export class ValidShippingAddressRule
  implements ISpecification<ShippingContext>
{
  async isSatisfiedBy(context: ShippingContext): Promise<SpecificationResult> {
    if (!context.shippingAddresses) {
      return SpecificationResult.failure(
        'Debes proporcionar direcciones de envío',
        'MISSING_SHIPPING_ADDRESSES',
      );
    }

    if (
      !context.shippingAddresses.origin ||
      !context.shippingAddresses.destination
    ) {
      return SpecificationResult.failure(
        'Direcciones de envío incompletas',
        'INCOMPLETE_SHIPPING_ADDRESSES',
      );
    }

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
