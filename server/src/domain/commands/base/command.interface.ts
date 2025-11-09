/**
 * Interfaz base para todos los comandos
 * Un comando representa una acción que modifica el estado del sistema
 */
export interface ICommand<TRequest = void, TResponse = void> {
  /**
   * Ejecuta el comando
   * @param request Datos de entrada del comando
   * @returns Resultado de la ejecución
   */
  execute(request: TRequest): Promise<TResponse>;
}

/**
 * Contexto de ejecución del comando
 * Contiene información sobre quién ejecuta, cuándo y desde dónde
 */
export interface CommandContext {
  userId: string;
  timestamp: Date;
  correlationId: string; // Para rastrear operaciones relacionadas
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * Resultado de la ejecución del comando
 */
export interface CommandResult<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  executedAt: Date;
  executionTimeMs: number;
}
