/**
 * Excepción base para violaciones de reglas de negocio
 *
 * Se usa cuando una operación no puede completarse porque
 * viola una regla de negocio del dominio
 */
export class BusinessRuleException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'BusinessRuleException';
    Object.setPrototypeOf(this, BusinessRuleException.prototype);
  }

  /**
   * Convierte la excepción a formato JSON para respuestas HTTP
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}
