/**
 * Resultado de una validación de especificación
 */
export class SpecificationResult {
  constructor(
    public readonly isValid: boolean,
    public readonly message: string = '',
    public readonly code: string = '',
    public readonly severity: 'error' | 'warning' | 'info' = 'error',
    public readonly details?: Record<string, any>,
  ) {}

  /**
   * Crea un resultado exitoso
   */
  static success(): SpecificationResult {
    return new SpecificationResult(true, '', '');
  }

  /**
   * Crea un resultado de error
   */
  static failure(
    message: string,
    code: string = 'VALIDATION_ERROR',
    details?: Record<string, any>,
  ): SpecificationResult {
    return new SpecificationResult(false, message, code, 'error', details);
  }

  /**
   * Crea una advertencia (válido pero con observaciones)
   */
  static warning(
    message: string,
    code: string = 'VALIDATION_WARNING',
    details?: Record<string, any>,
  ): SpecificationResult {
    return new SpecificationResult(true, message, code, 'warning', details);
  }

  /**
   * Crea información adicional
   */
  static info(
    message: string,
    code: string = 'VALIDATION_INFO',
    details?: Record<string, any>,
  ): SpecificationResult {
    return new SpecificationResult(true, message, code, 'info', details);
  }
}
