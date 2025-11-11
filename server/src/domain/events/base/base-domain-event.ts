import { IDomainEvent } from './domain-event.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Clase base abstracta para todos los eventos de dominio
 * Proporciona funcionalidad común como generación de IDs, timestamps, etc.
 */
export abstract class BaseDomainEvent implements IDomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly version: number;
  readonly occurredAt: Date;
  readonly userId: string;
  readonly data: Record<string, any>;
  readonly metadata?: {
    correlationId?: string;
    causationId?: string;
    source?: string;
    [key: string]: any;
  };

  constructor(
    aggregateType: string,
    aggregateId: string,
    userId: string,
    data: Record<string, any>,
    metadata?: {
      correlationId?: string;
      causationId?: string;
      source?: string;
      [key: string]: any;
    },
    version: number = 1,
  ) {
    this.eventId = uuidv4();
    this.eventType = this.constructor.name;
    this.aggregateType = aggregateType;
    this.aggregateId = aggregateId;
    this.version = version;
    this.occurredAt = new Date();
    this.userId = userId;
    this.data = data;
    this.metadata = metadata || {};
  }

  /**
   * Obtiene un resumen legible del evento
   */
  toString(): string {
    return `${this.eventType} on ${this.aggregateType}(${this.aggregateId}) by user ${this.userId}`;
  }

  /**
   * Convierte el evento a JSON
   */
  toJSON(): Record<string, any> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateType: this.aggregateType,
      aggregateId: this.aggregateId,
      version: this.version,
      occurredAt: this.occurredAt,
      userId: this.userId,
      data: this.data,
      metadata: this.metadata,
    };
  }
}
