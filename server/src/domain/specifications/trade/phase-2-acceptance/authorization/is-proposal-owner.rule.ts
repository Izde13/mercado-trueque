import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { AcceptanceContext } from '../acceptance-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 2.3: Solo el dueño del producto solicitado puede aceptar/rechazar
 */
@Injectable()
export class IsProposalOwnerRule implements ISpecification<AcceptanceContext> {
  async isSatisfiedBy(
    context: AcceptanceContext,
  ): Promise<SpecificationResult> {
    if (context.userId !== context.proposal.requestedProductOwnerId) {
      return SpecificationResult.failure(
        'No tienes permiso para responder esta propuesta. Solo el propietario del producto solicitado puede aceptar o rechazar.',
        'UNAUTHORIZED_PROPOSAL_RESPONSE',
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
