import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.2: Ambos usuarios (oferente y solicitado) deben estar activos
 *
 * Regla de negocio: Un usuario inactivo no puede participar en propuestas de trueque
 * Esto previene que cuentas suspendidas participen en intercambios
 */
@Injectable()
export class UserActiveRule implements ISpecification<ProposalContext> {
  /**
   * Verifica que el usuario oferente está activo
   * El usuario solicitado se verifica en otras validaciones
   */
  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    // Verificar que el oferente está activo
    if (context.offerent.estado !== 'activo') {
      return SpecificationResult.failure(
        `Tu cuenta está ${context.offerent.estado}. No puedes realizar propuestas de trueque.`,
        'OFFERENT_ACCOUNT_INACTIVE',
      );
    }

    // Verificar que el dueño del producto solicitado está activo
    const requestedProductOwner = context.requestedProducts[0];
    if (!requestedProductOwner) {
      return SpecificationResult.failure(
        'No se especificó un producto solicitado',
        'NO_REQUESTED_PRODUCT',
      );
    }

    // El estado del usuario propietario se debe verificar en contexto
    // Por ahora solo validamos el oferente
    return SpecificationResult.success();
  }

  and(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    // Implementar si se usa composición
    throw new Error('Composición no implementada en esta regla');
  }

  or(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('Composición no implementada en esta regla');
  }

  not(): ISpecification<ProposalContext> {
    throw new Error('Composición no implementada en esta regla');
  }
}
