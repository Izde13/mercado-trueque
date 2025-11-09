import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.3: El usuario no puede hacer trueque consigo mismo
 *
 * Regla de negocio: Un usuario no puede ser oferente y solicitante simultáneamente
 * Esto previene:
 * - Fraude (transferir productos entre sus propias cuentas)
 * - Manipulación de reputación (aumentar contador de intercambios artificialmente)
 * - Uso de la plataforma como almacenamiento personal
 */
@Injectable()
export class NoSelfTradeRule implements ISpecification<ProposalContext> {
  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    // El oferente es quien hace la propuesta
    const offerentId = context.offerent.id;

    // Verificar que al menos uno de los productos solicitados pertenezca a otro usuario
    for (const requestedProduct of context.requestedProducts) {
      if (requestedProduct.ownerId === offerentId) {
        return SpecificationResult.failure(
          'No puedes proponer un trueque con tu propio producto',
          'SELF_TRADE_ATTEMPT',
        );
      }
    }

    // Verificar que al menos uno de los productos ofrecidos NO pertenezca al solicitante
    // (aunque esto sería extraño en el flujo normal)
    for (const offeredProduct of context.offeredProducts) {
      if (offeredProduct.ownerId !== offerentId) {
        return SpecificationResult.failure(
          'No puedes ofrecer productos que no te pertenecen',
          'INVALID_OFFERED_PRODUCT_OWNER',
        );
      }
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
