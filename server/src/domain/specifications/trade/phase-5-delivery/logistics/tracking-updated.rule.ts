import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { DeliveryContext } from '../delivery-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 5.3: Tracking actualizado
 */
@Injectable()
export class TrackingUpdatedRule implements ISpecification<DeliveryContext> {
  async isSatisfiedBy(context: DeliveryContext): Promise<SpecificationResult> {
    // Esta regla es más informativa - se actualiza automáticamente

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
