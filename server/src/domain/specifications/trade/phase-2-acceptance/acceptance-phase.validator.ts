import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { AcceptanceContext } from './acceptance-context';
import { IsProposalOwnerRule } from './authorization/is-proposal-owner.rule';
import { ProposalStillPendingRule } from './state/proposal-still-pending.rule';
import { ProductsStillAvailableRule } from './state/products-still-available.rule';
import { CanCreateIntercambioRule } from './business/can-create-intercambio.rule';
import { DistributionCenterAvailableRule } from './business/distribution-center-available.rule';

/**
 * ORQUESTADOR DE FASE 2: ACEPTACIÓN
 *
 * Ejecuta 5 validaciones en orden:
 * 1. IsProposalOwnerRule
 * 2. ProposalStillPendingRule
 * 3. ProductsStillAvailableRule
 * 4. CanCreateIntercambioRule
 * 5. DistributionCenterAvailableRule
 */
@Injectable()
export class AcceptancePhaseValidator {
  constructor(
    private readonly isProposalOwnerRule: IsProposalOwnerRule,
    private readonly proposalStillPendingRule: ProposalStillPendingRule,
    private readonly productsStillAvailableRule: ProductsStillAvailableRule,
    private readonly canCreateIntercambioRule: CanCreateIntercambioRule,
    private readonly distributionCenterAvailableRule: DistributionCenterAvailableRule,
  ) {}

  async validate(context: AcceptanceContext): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];

    const validations = [
      { rule: this.isProposalOwnerRule, name: 'IsProposalOwnerRule' },
      { rule: this.proposalStillPendingRule, name: 'ProposalStillPendingRule' },
      {
        rule: this.productsStillAvailableRule,
        name: 'ProductsStillAvailableRule',
      },
      { rule: this.canCreateIntercambioRule, name: 'CanCreateIntercambioRule' },
      {
        rule: this.distributionCenterAvailableRule,
        name: 'DistributionCenterAvailableRule',
      },
    ];

    for (const { rule, name } of validations) {
      try {
        const result = await rule.isSatisfiedBy(context);

        if (!result.isValid && result.severity === 'error') {
          return result;
        }

        if (result.severity === 'warning') {
          warnings.push(result);
        }
      } catch (error) {
        console.error(`Error en validación ${name}:`, error);
        return SpecificationResult.failure(
          `Error interno en validación: ${name}`,
          'VALIDATION_ERROR',
        );
      }
    }

    if (warnings.length > 0) {
      return warnings[0];
    }

    return SpecificationResult.success();
  }

  async validateAll(
    context: AcceptanceContext,
  ): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      { rule: this.isProposalOwnerRule, name: 'IsProposalOwnerRule' },
      { rule: this.proposalStillPendingRule, name: 'ProposalStillPendingRule' },
      {
        rule: this.productsStillAvailableRule,
        name: 'ProductsStillAvailableRule',
      },
      { rule: this.canCreateIntercambioRule, name: 'CanCreateIntercambioRule' },
      {
        rule: this.distributionCenterAvailableRule,
        name: 'DistributionCenterAvailableRule',
      },
    ];

    for (const { rule, name } of validations) {
      try {
        const result = await rule.isSatisfiedBy(context);
        results.push(result);
      } catch (error) {
        results.push(
          SpecificationResult.failure(
            `Error en ${name}: ${error.message}`,
            'VALIDATION_ERROR',
          ),
        );
      }
    }

    return results;
  }
}
