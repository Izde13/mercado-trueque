import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../base/specification-result';
import { ProductPublicationContext } from './product-publication-context';
import { UserReputationLimitsRule } from './user/user-reputation-limits.rule';
import { ForbiddenContentDetectorRule } from './content/forbidden-content-detector.rule';
import { ActiveCategoryRule } from './category/active-category.rule';

/**
 * Orquestador de todas las validaciones de publicación de productos
 *
 * Ejecuta todas las reglas de negocio en orden de prioridad:
 * 1. Límites de reputación del usuario
 * 2. Contenido prohibido
 * 3. Categoría activa
 *
 * Retorna el primer error encontrado o acumula warnings
 */
@Injectable()
export class ProductPublicationValidator {
  constructor(
    private readonly userReputationLimits: UserReputationLimitsRule,
    private readonly forbiddenContentDetector: ForbiddenContentDetectorRule,
    private readonly activeCategoryRule: ActiveCategoryRule,
  ) {}

  /**
   * Valida el contexto completo de publicación
   *
   * @param context - Contexto con datos del producto y usuario
   * @returns SpecificationResult con el resultado de todas las validaciones
   */
  async validate(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult> {
    const warnings: SpecificationResult[] = [];
    const infos: SpecificationResult[] = [];

    // Ejecutar todas las validaciones en orden
    const validations = [
      this.userReputationLimits,
      this.forbiddenContentDetector,
      this.activeCategoryRule,
    ];

    for (const validation of validations) {
      const result = await validation.isSatisfiedBy(context);

      // Si es un error, retornar inmediatamente
      if (!result.isValid && result.severity === 'error') {
        return result;
      }

      // Acumular warnings e infos
      if (result.severity === 'warning') {
        warnings.push(result);
      } else if (result.severity === 'info') {
        infos.push(result);
      }
    }

    // Si hay warnings, retornar el más relevante (el primero)
    if (warnings.length > 0) {
      return warnings[0];
    }

    // Si hay infos, retornar el primero
    if (infos.length > 0) {
      return infos[0];
    }

    // Todo OK
    return SpecificationResult.success();
  }

  /**
   * Valida el contexto y retorna todas las validaciones (no para solo en el primer error)
   * Útil para debugging o para mostrar múltiples errores al usuario
   *
   * @param context - Contexto con datos del producto y usuario
   * @returns Array con todos los resultados de validación
   */
  async validateAll(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult[]> {
    const results: SpecificationResult[] = [];

    const validations = [
      this.userReputationLimits,
      this.forbiddenContentDetector,
      this.activeCategoryRule,
    ];

    for (const validation of validations) {
      const result = await validation.isSatisfiedBy(context);
      results.push(result);
    }

    return results;
  }
}
