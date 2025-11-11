/**
 * Interfaz base para todos los eventos de dominio
 * Un evento de dominio representa algo que ocurrió en el dominio del negocio
 */
export interface IDomainEvent {
  /**
   * Identificador único del evento
   */
  eventId: string;

  /**
   * Tipo del evento (ej: 'ProposalCreated', 'TradeAccepted')
   */
  eventType: string;

  /**
   * Agregado que generó el evento (ej: 'Trade', 'Proposal')
   */
  aggregateType: string;

  /**
   * ID del agregado que generó el evento
   */
  aggregateId: string;

  /**
   * Versión del evento (para ordenamiento)
   */
  version: number;

  /**
   * Timestamp cuando ocurrió el evento
   */
  occurredAt: Date;

  /**
   * Usuario que causó el evento
   */
  userId: string;

  /**
   * Datos específicos del evento
   */
  data: Record<string, any>;

  /**
   * Metadatos del evento
   */
  metadata?: {
    correlationId?: string;
    causationId?: string;
    source?: string;
    [key: string]: any;
  };
}

/**
 * Interfaz para manejadores de eventos de dominio
 */
export interface IDomainEventHandler<T extends IDomainEvent = IDomainEvent> {
  /**
   * Maneja un evento de dominio
   * @param event El evento a procesar
   */
  handle(event: T): Promise<void>;

  /**
   * Tipos de eventos que este handler puede procesar
   */
  canHandle(eventType: string): boolean;
}

/**
 * Resultado de la publicación de un evento
 */
export interface EventPublishResult {
  success: boolean;
  eventId: string;
  handlersExecuted: number;
  handlersFailed: number;
  errors?: Array<{
    handlerName: string;
    error: string;
  }>;
}
