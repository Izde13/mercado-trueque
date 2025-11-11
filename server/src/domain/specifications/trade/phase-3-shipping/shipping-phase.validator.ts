import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { ShippingContext } from './shipping-context';
import { IntercambioAcceptedRule } from './state/intercambio-accepted.rule';
import { ValidShippingAddressRule } from './logistics/valid-shipping-address.rule';
import { TrackingCodeGenerationRule } from './logistics/tracking-code-generation.rule';
import { ShippingCostPaymentRule } from './business/shipping-cost-payment.rule';

/**
 * ORQUESTADOR DE FASE 3: ENVÍO
 *
 * Ejecuta 5 validaciones:
 * 1. IntercambioAcceptedRule
 * 2. ValidShippingAddressRule
 * 3. TrackingCodeGenerationRule
 * 4. ShippingCostPaymentRule
 */
@Injectable()
export class ShippingPhaseValidator {
  constructor(
    private readonly intercambioAcceptedRule: IntercambioAcceptedRule,
    private readonly validShippingAddressRule: ValidShippingAddressRule,
    private readonly trackingCodeGenerationRule: TrackingCodeGenerationRule,
    private readonly shippingCostPaymentRule: ShippingCostPaymentRule,
  ) {}

  async validate(context: ShippingContext): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];

    const validations = [
      { rule: this.intercambioAcceptedRule, name: 'IntercambioAcceptedRule' },
      {
        rule: this.validShippingAddressRule,
        name: 'ValidShippingAddressRule',
      },
      {
        rule: this.trackingCodeGenerationRule,
        name: 'TrackingCodeGenerationRule',
      },
      {
        rule: this.shippingCostPaymentRule,
        name: 'ShippingCostPaymentRule',
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

  async validateAll(context: ShippingContext): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      { rule: this.intercambioAcceptedRule, name: 'IntercambioAcceptedRule' },
      {
        rule: this.validShippingAddressRule,
        name: 'ValidShippingAddressRule',
      },
      {
        rule: this.trackingCodeGenerationRule,
        name: 'TrackingCodeGenerationRule',
      },
      {
        rule: this.shippingCostPaymentRule,
        name: 'ShippingCostPaymentRule',
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
