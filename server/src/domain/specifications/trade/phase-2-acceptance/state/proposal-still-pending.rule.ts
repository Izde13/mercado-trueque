import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { AcceptanceContext } from '../acceptance-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 2.1: La propuesta debe existir y estar pendiente
 */
@Injectable()
export class ProposalStillPendingRule
  implements ISpecification<AcceptanceContext>
{
  async isSatisfiedBy(
    context: AcceptanceContext,
  ): Promise<SpecificationResult> {
    if (context.proposal.status !== 'pendiente') {
      return SpecificationResult.failure(
        `Esta propuesta ya fue respondida (estado: ${context.proposal.status}). No se puede aceptar o rechazar nuevamente.`,
        'PROPOSAL_ALREADY_RESPONDED',
      );
    }

    // Validar que no haya expirado (30 días)
    const daysSinceCreation = Math.floor(
      (Date.now() - context.proposal.createdAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreation > 30) {
      return SpecificationResult.failure(
        'Esta propuesta ha expirado (más de 30 días). Ya no puedes aceptarla o rechazarla.',
        'PROPOSAL_EXPIRED',
      );
    }

    // Warning si está cerca de expirar
    if (daysSinceCreation > 25) {
      return SpecificationResult.warning(
        `Esta propuesta vence en ${30 - daysSinceCreation} días. Responde pronto.`,
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
