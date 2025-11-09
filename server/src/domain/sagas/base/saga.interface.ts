import { IDomainEvent } from '../../events/base/domain-event.interface';

/**
 * Paso individual de una saga
 */
export interface SagaStep {
  /**
   * Nombre único del paso
   */
  name: string;

  /**
   * Descripción del paso
   */
  description?: string;

  /**
   * Orden de ejecución
   */
  order: number;

  /**
   * Si es verdadero, la saga continúa incluso si este paso falla
   */
  continueOnFailure?: boolean;

  /**
   * Paso de compensación si este paso falla
   */
  compensationStep?: SagaStep;
}

/**
 * Contexto de ejecución de una saga
 */
export interface SagaExecutionContext {
  /**
   * ID único de esta ejecución de saga
   */
  executionId: string;

  /**
   * ID de correlación para rastrear operaciones relacionadas
   */
  correlationId: string;

  /**
   * Usuario que inició la saga
   */
  userId: string;

  /**
   * Datos iniciales de la saga
   */
  data: Record<string, any>;

  /**
   * Pasos completados
   */
  completedSteps: string[];

  /**
   * Pasos pendientes
   */
  pendingSteps: string[];

  /**
   * Eventos generados durante la ejecución
   */
  events: IDomainEvent[];

  /**
   * Errores que ocurrieron
   */
  errors: Array<{
    step: string;
    error: string;
    timestamp: Date;
  }>;

  /**
   * Estado de la saga
   */
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'compensating';

  /**
   * Timestamp de inicio
   */
  startedAt: Date;

  /**
   * Timestamp de finalización
   */
  finishedAt?: Date;

  /**
   * Metadatos adicionales
   */
  metadata?: Record<string, any>;
}

/**
 * Interfaz base para todas las sagas
 * Una saga orquesta una transacción distribuida a través de múltiples servicios
 */
export interface ISaga {
  /**
   * Nombre único de la saga
   */
  readonly name: string;

  /**
   * Descripción de qué hace esta saga
   */
  readonly description?: string;

  /**
   * Pasos de la saga
   */
  readonly steps: SagaStep[];

  /**
   * Obtiene el siguiente paso a ejecutar
   */
  getNextStep(context: SagaExecutionContext): SagaStep | null;

  /**
   * Ejecuta un paso específico
   */
  executeStep(
    context: SagaExecutionContext,
    step: SagaStep,
  ): Promise<{ success: boolean; data?: any; error?: string }>;

  /**
   * Ejecuta el paso de compensación
   */
  compensate(
    context: SagaExecutionContext,
    step: SagaStep,
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Maneja un evento que afecta la ejecución de la saga
   */
  handleEvent(
    context: SagaExecutionContext,
    event: IDomainEvent,
  ): Promise<void>;

  /**
   * Valida si la saga puede proceder
   */
  canProceed(context: SagaExecutionContext): boolean;
}

/**
 * Resultado de la ejecución de una saga
 */
export interface SagaExecutionResult {
  success: boolean;
  context: SagaExecutionContext;
  errors?: Array<{
    step: string;
    error: string;
  }>;
  executionTimeMs: number;
}
