import { Injectable, Logger } from '@nestjs/common';
import {
  IDomainEvent,
  IDomainEventHandler,
  EventPublishResult,
} from './domain-event.interface';

/**
 * Bus de eventos de dominio
 * Orquestrador central para publicar y suscribirse a eventos de dominio
 * Implementa el patrón Observer/Pub-Sub para desacoplar productores de eventos
 * de sus consumidores
 */
@Injectable()
export class EventBus {
  private readonly logger = new Logger(EventBus.name);
  private handlers = new Map<string, Set<IDomainEventHandler>>();

  /**
   * Suscribe un handler a un tipo de evento
   * @param eventType Tipo de evento (ej: 'ProposalCreated')
   * @param handler Handler que procesará el evento
   */
  subscribe<T extends IDomainEvent>(
    eventType: string,
    handler: IDomainEventHandler<T>,
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);
    this.logger.debug(`Handler subscribed to event: ${eventType}`);
  }

  /**
   * Des-suscribe un handler de un tipo de evento
   */
  unsubscribe(eventType: string, handler: IDomainEventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Publica un evento de dominio a todos los handlers suscritos
   * Ejecuta los handlers de forma secuencial
   * @param event Evento a publicar
   * @returns Resultado de la publicación
   */
  async publish<T extends IDomainEvent>(event: T): Promise<EventPublishResult> {
    const handlers = this.handlers.get(event.eventType) || new Set();
    const errors: Array<{ handlerName: string; error: string }> = [];

    this.logger.log(`Publishing event: ${event.eventType} (${event.eventId})`);

    let handlersExecuted = 0;
    let handlersFailed = 0;

    for (const handler of handlers) {
      try {
        await handler.handle(event);
        handlersExecuted++;
      } catch (error: any) {
        handlersFailed++;
        const errorMessage = error?.message || 'Unknown error';
        this.logger.error(
          `Handler failed for event ${event.eventType}: ${errorMessage}`,
        );
        errors.push({
          handlerName: handler.constructor.name,
          error: errorMessage,
        });
      }
    }

    const result: EventPublishResult = {
      success: handlersFailed === 0,
      eventId: event.eventId,
      handlersExecuted,
      handlersFailed,
      errors: errors.length > 0 ? errors : undefined,
    };

    this.logger.log(
      `Event ${event.eventType} published - Executed: ${handlersExecuted}, Failed: ${handlersFailed}`,
    );

    return result;
  }

  /**
   * Publica múltiples eventos de forma secuencial
   */
  async publishAll<T extends IDomainEvent>(
    events: T[],
  ): Promise<EventPublishResult[]> {
    const results: EventPublishResult[] = [];

    for (const event of events) {
      const result = await this.publish(event);
      results.push(result);
    }

    return results;
  }

  /**
   * Obtiene los handlers para un tipo de evento
   */
  getHandlers(eventType: string): Set<IDomainEventHandler> {
    return this.handlers.get(eventType) || new Set();
  }

  /**
   * Obtiene todos los handlers registrados
   */
  getAllHandlers(): Map<string, Set<IDomainEventHandler>> {
    return new Map(this.handlers);
  }

  /**
   * Verifica si hay handlers para un tipo de evento
   */
  hasHandlers(eventType: string): boolean {
    return (
      this.handlers.has(eventType) && this.handlers.get(eventType)!.size > 0
    );
  }

  /**
   * Limpia todos los handlers registrados
   */
  clearHandlers(): void {
    this.handlers.clear();
  }

  /**
   * Obtiene el número total de handlers registrados
   */
  getTotalHandlerCount(): number {
    let count = 0;
    for (const handlers of this.handlers.values()) {
      count += handlers.size;
    }
    return count;
  }
}
