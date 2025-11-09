import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { ProposalContext } from './proposal-context';
import { ProductActiveRule } from './data/product-active.rule';
import { UserActiveRule } from './data/user-active.rule';
import { MinimumRatingRule } from './reputation/minimum-rating.rule';
import { NoDuplicateProposalRule } from './logic/no-duplicate-proposal.rule';
import { NoSelfTradeRule } from './logic/no-self-trade.rule';
import { ProductsAvailableRule } from './logic/products-available.rule';
import { ValueBalanceRule } from './business/value-balance.rule';

/**
 * ORQUESTADOR DE FASE 1: PROPUESTA
 *
 * Ejecuta todas las 8 validaciones en orden de prioridad:
 * 1. ProductActiveRule - Producto solicitado está activo
 * 2. UserActiveRule - Usuario está activo
 * 3. MinimumRatingRule - Usuario tiene reputación mínima
 * 4. NoDuplicateProposalRule - No hay propuesta pendiente igual
 * 5. NoSelfTradeRule - No es auto-trueque
 * 6. ProductsAvailableRule - Productos ofrecidos son válidos
 * 7. ValueBalanceRule - Balance de valor (warning)
 *
 * Detiene en el primer ERROR encontrado
 * Acumula y retorna el primer WARNING si no hay errores
 */
@Injectable()
export class ProposalPhaseValidator {
  constructor(
    private readonly productActiveRule: ProductActiveRule,
    private readonly userActiveRule: UserActiveRule,
    private readonly minimumRatingRule: MinimumRatingRule,
    private readonly noDuplicateProposalRule: NoDuplicateProposalRule,
    private readonly noSelfTradeRule: NoSelfTradeRule,
    private readonly productsAvailableRule: ProductsAvailableRule,
    private readonly valueBalanceRule: ValueBalanceRule,
  ) {}

  /**
   * Valida el contexto de propuesta
   * Retorna el primer error o warning encontrado
   */
  async validate(context: ProposalContext): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];

    // Orden de validaciones (por prioridad)
    const validations = [
      // 1. Validaciones de datos (críticas)
      { rule: this.productActiveRule, name: 'ProductActiveRule' },
      { rule: this.userActiveRule, name: 'UserActiveRule' },

      // 2. Validaciones de reputación
      { rule: this.minimumRatingRule, name: 'MinimumRatingRule' },

      // 3. Validaciones de lógica
      { rule: this.noDuplicateProposalRule, name: 'NoDuplicateProposalRule' },
      { rule: this.noSelfTradeRule, name: 'NoSelfTradeRule' },
      { rule: this.productsAvailableRule, name: 'ProductsAvailableRule' },

      // 4. Validaciones de negocio (pueden ser warnings)
      { rule: this.valueBalanceRule, name: 'ValueBalanceRule' },
    ];

    // Ejecutar validaciones en orden
    for (const { rule, name } of validations) {
      try {
        const result = await rule.isSatisfiedBy(context);

        // Si hay un error, retornar inmediatamente
        if (!result.isValid && result.severity === 'error') {
          return result;
        }

        // Acumular warnings
        if (result.severity === 'warning') {
          warnings.push(result);
        }
      } catch (error) {
        console.error(`Error en validación ${name}:`, error);
        return SpecificationResult.failure(
          `Error interno durante validación: ${name}`,
          'VALIDATION_ERROR',
        );
      }
    }

    // Si hay warnings, retornar el primero
    if (warnings.length > 0) {
      return warnings[0];
    }

    // Si todas las validaciones pasaron
    return SpecificationResult.success();
  }

  /**
   * Valida el contexto ejecutando TODAS las reglas sin parar
   * Retorna todos los errores y warnings encontrados
   * Útil para mostrar múltiples errores al usuario simultáneamente
   */
  async validateAll(context: ProposalContext): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      { rule: this.productActiveRule, name: 'ProductActiveRule' },
      { rule: this.userActiveRule, name: 'UserActiveRule' },
      { rule: this.minimumRatingRule, name: 'MinimumRatingRule' },
      { rule: this.noDuplicateProposalRule, name: 'NoDuplicateProposalRule' },
      { rule: this.noSelfTradeRule, name: 'NoSelfTradeRule' },
      { rule: this.productsAvailableRule, name: 'ProductsAvailableRule' },
      { rule: this.valueBalanceRule, name: 'ValueBalanceRule' },
    ];

    for (const { rule, name } of validations) {
      try {
        const result = await rule.isSatisfiedBy(context);
        results.push(result);
      } catch (error) {
        results.push(
          SpecificationResult.failure(
            `Error en validación ${name}: ${error.message}`,
            'VALIDATION_ERROR',
          ),
        );
      }
    }

    return results;
  }

  /**
   * Obtiene información sobre todas las validaciones (para debugging/logs)
   */
  getValidationSummary(results: SpecificationResult[]): {
    totalValidations: number;
    errors: number;
    warnings: number;
    infos: number;
    passed: number;
  } {
    return {
      totalValidations: results.length,
      errors: results.filter((r) => !r.isValid && r.severity === 'error')
        .length,
      warnings: results.filter((r) => r.severity === 'warning').length,
      infos: results.filter((r) => r.severity === 'info').length,
      passed: results.filter((r) => r.isValid).length,
    };
  }
}
