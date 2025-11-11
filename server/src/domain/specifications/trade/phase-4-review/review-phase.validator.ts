import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { ReviewContext } from './review-context';
import { ProductsReceivedAtCenterRule } from './state/products-received-at-center.rule';
import { ProductConditionMatchesRule } from './quality/product-condition-matches.rule';
import { PhotosUploadedRule } from './quality/photos-uploaded.rule';
import { ObservationsIfDamagedRule } from './quality/observations-if-damaged.rule';

/**
 * ORQUESTADOR DE FASE 4: REVISIÓN
 */
@Injectable()
export class ReviewPhaseValidator {
  constructor(
    private readonly productsReceivedAtCenterRule: ProductsReceivedAtCenterRule,
    private readonly productConditionMatchesRule: ProductConditionMatchesRule,
    private readonly photosUploadedRule: PhotosUploadedRule,
    private readonly observationsIfDamagedRule: ObservationsIfDamagedRule,
  ) {}

  async validate(context: ReviewContext): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];

    const validations = [
      {
        rule: this.productsReceivedAtCenterRule,
        name: 'ProductsReceivedAtCenterRule',
      },
      {
        rule: this.productConditionMatchesRule,
        name: 'ProductConditionMatchesRule',
      },
      { rule: this.photosUploadedRule, name: 'PhotosUploadedRule' },
      {
        rule: this.observationsIfDamagedRule,
        name: 'ObservationsIfDamagedRule',
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

  async validateAll(context: ReviewContext): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      {
        rule: this.productsReceivedAtCenterRule,
        name: 'ProductsReceivedAtCenterRule',
      },
      {
        rule: this.productConditionMatchesRule,
        name: 'ProductConditionMatchesRule',
      },
      { rule: this.photosUploadedRule, name: 'PhotosUploadedRule' },
      {
        rule: this.observationsIfDamagedRule,
        name: 'ObservationsIfDamagedRule',
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
