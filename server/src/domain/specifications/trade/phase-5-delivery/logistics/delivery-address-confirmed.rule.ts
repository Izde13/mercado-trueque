import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { DeliveryContext } from '../delivery-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 5.2: Dirección de entrega confirmada
 */
@Injectable()
export class DeliveryAddressConfirmedRule
  implements ISpecification<DeliveryContext>
{
  async isSatisfiedBy(context: DeliveryContext): Promise<SpecificationResult> {
    if (
      !context.deliveryAddress ||
      context.deliveryAddress.trim().length === 0
    ) {
      return SpecificationResult.failure(
        'Debes confirmar la dirección de entrega',
        'DELIVERY_ADDRESS_MISSING',
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
