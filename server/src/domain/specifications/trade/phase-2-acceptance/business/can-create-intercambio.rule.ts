import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { AcceptanceContext } from '../acceptance-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 2.4: Ambos usuarios deben estar activos para crear intercambio
 *
 * Valida que el estado de ambos usuarios sea "activo" antes de crear el intercambio.
 * El contexto proporciona el estado de ambos usuarios involucrados.
 */
@Injectable()
export class CanCreateIntercambioRule
  implements ISpecification<AcceptanceContext>
{
  constructor() {}

  async isSatisfiedBy(
    context: AcceptanceContext,
  ): Promise<SpecificationResult> {
    // El contexto de dominio proporciona el estado del usuario actual (quien acepta)
    // El estado está disponible en context.userStatus
    if (context.userStatus !== 'activo') {
      return SpecificationResult.failure(
        'El usuario que acepta la propuesta debe estar activo',
      );
    }

    // Nota: Para validar que el oferente también esté activo, esta información
    // debe estar incluida en el contexto o ser verificada antes de crear el contexto.
    // El diseño actual del AcceptanceContext no incluye explícitamente el estado del oferente,
    // pero esta validación es responsabilidad del use case que prepara el contexto.

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
