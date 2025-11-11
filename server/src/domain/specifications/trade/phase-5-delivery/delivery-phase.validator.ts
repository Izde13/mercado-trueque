import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { DeliveryContext } from './delivery-context';
import { ReviewApprovedRule } from './state/review-approved.rule';
import { DeliveryAddressConfirmedRule } from './logistics/delivery-address-confirmed.rule';
import { TrackingUpdatedRule } from './logistics/tracking-updated.rule';
import { DeliveryConfirmationRule } from './business/delivery-confirmation.rule';

/**
 * ORQUESTADOR DE FASE 5: ENTREGA
 */
@Injectable()
export class DeliveryPhaseValidator {
  constructor(
    private readonly reviewApprovedRule: ReviewApprovedRule,
    private readonly deliveryAddressConfirmedRule: DeliveryAddressConfirmedRule,
    private readonly trackingUpdatedRule: TrackingUpdatedRule,
    private readonly deliveryConfirmationRule: DeliveryConfirmationRule,
  ) {}

  async validate(context: DeliveryContext): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];

    const validations = [
      { rule: this.reviewApprovedRule, name: 'ReviewApprovedRule' },
      {
        rule: this.deliveryAddressConfirmedRule,
        name: 'DeliveryAddressConfirmedRule',
      },
      { rule: this.trackingUpdatedRule, name: 'TrackingUpdatedRule' },
      {
        rule: this.deliveryConfirmationRule,
        name: 'DeliveryConfirmationRule',
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

  async validateAll(context: DeliveryContext): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      { rule: this.reviewApprovedRule, name: 'ReviewApprovedRule' },
      {
        rule: this.deliveryAddressConfirmedRule,
        name: 'DeliveryAddressConfirmedRule',
      },
      { rule: this.trackingUpdatedRule, name: 'TrackingUpdatedRule' },
      {
        rule: this.deliveryConfirmationRule,
        name: 'DeliveryConfirmationRule',
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
