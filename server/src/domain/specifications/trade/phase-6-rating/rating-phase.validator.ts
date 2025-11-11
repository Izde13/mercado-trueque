import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../base/specification-result';
import { RatingContext } from './rating-context';
import { TradeDeliveredRule } from './state/trade-delivered.rule';
import { CanRateUserRule } from './authorization/can-rate-user.rule';
import { RatingRangeRule } from './validation/rating-range.rule';
import { CommentRequiredIfLowRule } from './validation/comment-required-if-low.rule';
import { DuplicateRatingRule } from './validation/duplicate-rating.rule';

/**
 * VALIDADOR FASE 6: Calificación
 * Orquesta todas las validaciones de negocio para la fase de calificación
 */
@Injectable()
export class RatingPhaseValidator {
  constructor(
    private readonly tradeDeliveredRule: TradeDeliveredRule,
    private readonly canRateUserRule: CanRateUserRule,
    private readonly ratingRangeRule: RatingRangeRule,
    private readonly commentRequiredIfLowRule: CommentRequiredIfLowRule,
    private readonly duplicateRatingRule: DuplicateRatingRule,
  ) {}

  /**
   * Ejecuta validaciones en orden de prioridad
   * Se detiene en el primer error encontrado
   */
  async validate(context: RatingContext): Promise<SpecificationResult> {
    // 1. Validar estado del intercambio (crítico)
    const stateResult = await this.tradeDeliveredRule.isSatisfiedBy(context);
    if (!stateResult.isValid) return stateResult;

    // 2. Validar autorización (crítico)
    const authResult = await this.canRateUserRule.isSatisfiedBy(context);
    if (!authResult.isValid) return authResult;

    // 3. Validar no existan calificaciones previas (crítico)
    const duplicateResult =
      await this.duplicateRatingRule.isSatisfiedBy(context);
    if (!duplicateResult.isValid) return duplicateResult;

    // 4. Validar rangos de calificación (crítico)
    const rangeResult = await this.ratingRangeRule.isSatisfiedBy(context);
    if (!rangeResult.isValid) return rangeResult;

    // 5. Validar comentario si calificación baja (crítico)
    const commentResult =
      await this.commentRequiredIfLowRule.isSatisfiedBy(context);
    if (!commentResult.isValid) return commentResult;

    // Si todas las validaciones pasaron
    return SpecificationResult.success();
  }

  /**
   * Ejecuta todas las validaciones y retorna los resultados
   * NO se detiene en errores, retorna todos los resultados
   */
  async validateAll(context: RatingContext): Promise<SpecificationResult[]> {
    const results = await Promise.all([
      this.tradeDeliveredRule.isSatisfiedBy(context),
      this.canRateUserRule.isSatisfiedBy(context),
      this.duplicateRatingRule.isSatisfiedBy(context),
      this.ratingRangeRule.isSatisfiedBy(context),
      this.commentRequiredIfLowRule.isSatisfiedBy(context),
    ]);

    return results;
  }

  /**
   * Obtiene un resumen de las validaciones
   */
  async getValidationSummary(context: RatingContext) {
    const results = await this.validateAll(context);

    const errors = results.filter((r) => !r.isValid);
    const hasErrors = errors.length > 0;

    return {
      isValid: !hasErrors,
      totalValidations: results.length,
      totalErrors: errors.length,
      errors: errors.map((e) => ({
        message: e.message,
        code: e.code,
        severity: e.severity,
      })),
      validations: results.map((r, index) => ({
        name: [
          'TradeDelivered',
          'CanRateUser',
          'DuplicateRating',
          'RatingRange',
          'CommentRequiredIfLow',
        ][index],
        isValid: r.isValid,
        message: r.message,
        code: r.code,
      })),
    };
  }
}
