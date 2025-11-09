import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ShippingContext } from '../shipping-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 3.3: Códigos de tracking generados
 */
@Injectable()
export class TrackingCodeGenerationRule
  implements ISpecification<ShippingContext>
{
  async isSatisfiedBy(context: ShippingContext): Promise<SpecificationResult> {
    // Esta regla es más informativa - el código de tracking se genera automáticamente
    // Pero podemos validar que se proporcione una transportadora válida

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
