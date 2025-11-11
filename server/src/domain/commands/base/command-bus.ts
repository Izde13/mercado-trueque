import { Injectable, Type } from '@nestjs/common';
import { ICommand, CommandResult, CommandContext } from './command.interface';

/**
 * Registro de handlers de comandos
 * Mapea tipos de comandos a sus handlers
 */
type CommandHandler<TCommand extends ICommand<any, any>> = new (
  ...args: any[]
) => TCommand;

/**
 * Bus de comandos - Orquestador central para ejecutar comandos
 * Implementa el patrón Command Bus para desacoplar la emisión de comandos
 * de su ejecución
 */
@Injectable()
export class CommandBus {
  private handlers = new Map<string, ICommand<any, any>>();

  /**
   * Registra un handler de comando
   * @param commandType Tipo del comando
   * @param handler Instancia del handler
   */
  registerHandler<TCommand extends ICommand<any, any>>(
    commandType: string,
    handler: TCommand,
  ): void {
    this.handlers.set(commandType, handler);
  }

  /**
   * Ejecuta un comando de forma síncrona
   * @param commandType Tipo del comando
   * @param request Datos de entrada
   * @returns Resultado de la ejecución
   */
  async execute<TRequest = void, TResponse = void>(
    commandType: string,
    request: TRequest,
  ): Promise<CommandResult<TResponse>> {
    const startTime = Date.now();

    try {
      const handler = this.handlers.get(commandType);

      if (!handler) {
        return {
          success: false,
          error: {
            code: 'HANDLER_NOT_FOUND',
            message: `No handler registered for command: ${commandType}`,
          },
          executedAt: new Date(),
          executionTimeMs: Date.now() - startTime,
        };
      }

      const data = await handler.execute(request);

      return {
        success: true,
        data,
        executedAt: new Date(),
        executionTimeMs: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'EXECUTION_ERROR',
          message: error.message || 'Error executing command',
          details: error.details,
        },
        executedAt: new Date(),
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Obtiene un handler registrado
   */
  getHandler<TCommand extends ICommand<any, any>>(
    commandType: string,
  ): TCommand | undefined {
    return this.handlers.get(commandType) as TCommand | undefined;
  }

  /**
   * Verifica si existe un handler para un comando
   */
  hasHandler(commandType: string): boolean {
    return this.handlers.has(commandType);
  }

  /**
   * Obtiene todos los handlers registrados
   */
  getAllHandlers(): Map<string, ICommand<any, any>> {
    return new Map(this.handlers);
  }

  /**
   * Limpia todos los handlers registrados
   */
  clearHandlers(): void {
    this.handlers.clear();
  }
}
