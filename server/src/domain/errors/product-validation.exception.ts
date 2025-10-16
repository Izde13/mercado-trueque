import { BusinessRuleException } from './business-rule.exception';

/**
 * Excepción específica para errores de validación de productos
 *
 * Se lanza cuando un producto no cumple con las reglas de negocio
 * para ser publicado en la plataforma
 */
export class ProductValidationException extends BusinessRuleException {
  constructor(message: string, code: string, details?: Record<string, any>) {
    super(message, code, details);
    this.name = 'ProductValidationException';
    Object.setPrototypeOf(this, ProductValidationException.prototype);
  }

  /**
   * Crea una excepción a partir de un SpecificationResult
   */
  static fromSpecificationResult(result: {
    message: string;
    errorCode?: string;
    metadata?: Record<string, any>;
  }): ProductValidationException {
    return new ProductValidationException(
      result.message,
      result.errorCode || 'PRODUCT_VALIDATION_FAILED',
      result.metadata,
    );
  }
}
