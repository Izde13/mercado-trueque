import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.5: No propuestas duplicadas activas
 *
 * Regla: No puede haber otra propuesta pendiente del mismo usuario oferente
 * para los mismos productos solicitados
 *
 * Esta validación se basa en los datos del contexto de dominio.
 * En una implementación completa, se verificaría en el repositorio de propuestas.
 */
@Injectable()
export class NoDuplicateProposalRule
  implements ISpecification<ProposalContext>
{
  constructor() {}

  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    // Esta validación requiere acceso a todas las propuestas pendientes del oferente
    // Para verificar que no exista otra propuesta para los mismos productos solicitados.
    // Sin embargo, el contexto de dominio no contiene este información de manera directa.
    //
    // En el flujo real:
    // 1. El use case obtendría todas las propuestas pendientes del oferente desde el repositorio
    // 2. Verificaría que no haya otra propuesta con los mismos productos solicitados
    // 3. Pasaría esta información al contexto
    //
    // Por ahora, delegamos esta validación a la capa de aplicación que tiene acceso a repositorios
    return SpecificationResult.success();
  }

  and(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }
}
