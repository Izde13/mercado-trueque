import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.7: Balance de valor (Warning)
 *
 * Regla de negocio: Si hay diferencia > 20% entre valores, generar warning
 * Esta validación NO bloquea, solo advierte al usuario y al otro participante
 */
@Injectable()
export class ValueBalanceRule implements ISpecification<ProposalContext> {
  private readonly MAX_VALUE_DIFFERENCE = 0.2; // 20%

  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    const offeredValue = context.totalOfferedValue || 0;
    const requestedValue = context.totalRequestedValue || 0;

    // No validar si los valores son cero
    if (offeredValue === 0 || requestedValue === 0) {
      return SpecificationResult.success();
    }

    // Calcular diferencia porcentual
    const maxValue = Math.max(offeredValue, requestedValue);
    const minValue = Math.min(offeredValue, requestedValue);
    const difference = (maxValue - minValue) / maxValue;

    if (difference > this.MAX_VALUE_DIFFERENCE) {
      const differencePercentage = (difference * 100).toFixed(0);
      const valueDifference = Math.abs(offeredValue - requestedValue);

      return SpecificationResult.warning(
        `Hay una diferencia de ${differencePercentage}% en los valores. Ofertas: $${offeredValue.toLocaleString('es-CO')} vs Solicitado: $${requestedValue.toLocaleString('es-CO')} (diferencia: $${valueDifference.toLocaleString('es-CO')}). El otro usuario puede rechazar esta propuesta.`,
        'VALUE_BALANCE_WARNING',
      );
    }

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
