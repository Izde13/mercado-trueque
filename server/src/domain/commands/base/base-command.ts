import { ICommand, CommandContext, CommandResult } from './command.interface';

/**
 * Clase base abstracta para todos los comandos
 * Proporciona funcionalidad común: validación, logging, manejo de errores
 */
export abstract class BaseCommand<TRequest = void, TResponse = void>
  implements ICommand<TRequest, TResponse>
{
  protected context?: CommandContext;

  /**
   * Constructor que acepta el contexto de ejecución
   */
  constructor(context?: CommandContext) {
    this.context = context;
  }

  /**
   * Método abstracto que debe implementarse en subclases
   * Contiene la lógica específica del comando
   */
  abstract executeCommand(request: TRequest): Promise<TResponse>;

  /**
   * Método de validación que puede sobrescribirse en subclases
   * Por defecto, no realiza validaciones
   */
  protected async validate(request: TRequest): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Método hook ejecutado antes del comando
   */
  protected async onBeforeExecute(request: TRequest): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Método hook ejecutado después de la ejecución exitosa
   */
  protected async onAfterExecute(
    request: TRequest,
    response: TResponse,
  ): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Método hook para manejar errores
   */
  protected async onError(request: TRequest, error: Error): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Implementación del patrón de comando con validación y hooks
   */
  async execute(request: TRequest): Promise<TResponse> {
    try {
      // Validar entrada
      await this.validate(request);

      // Hook pre-ejecución
      await this.onBeforeExecute(request);

      // Ejecutar comando
      const response = await this.executeCommand(request);

      // Hook post-ejecución
      await this.onAfterExecute(request, response);

      return response;
    } catch (error: any) {
      // Hook de error
      await this.onError(request, error);

      // Re-lanzar error
      throw error;
    }
  }

  /**
   * Obtiene el contexto del comando
   */
  getContext(): CommandContext | undefined {
    return this.context;
  }

  /**
   * Establece el contexto del comando
   */
  setContext(context: CommandContext): void {
    this.context = context;
  }

  /**
   * Genera una respuesta de error estructurada
   */
  protected createError(
    code: string,
    message: string,
    details?: Record<string, any>,
  ) {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }
}
