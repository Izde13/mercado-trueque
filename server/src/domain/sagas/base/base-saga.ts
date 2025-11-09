import { ISaga, SagaStep, SagaExecutionContext } from './saga.interface';
import { IDomainEvent } from '../../events/base/domain-event.interface';
import { Logger } from '@nestjs/common';

/**
 * Clase base abstracta para todas las sagas
 * Proporciona funcionalidad común para gestionar pasos y compensaciones
 */
export abstract class BaseSaga implements ISaga {
  protected readonly logger = new Logger(this.constructor.name);

  abstract readonly name: string;
  abstract readonly description?: string;
  abstract readonly steps: SagaStep[];

  /**
   * Obtiene el siguiente paso a ejecutar
   * Por defecto, retorna el siguiente paso pendiente en orden
   */
  getNextStep(context: SagaExecutionContext): SagaStep | null {
    const nextStepName = context.pendingSteps[0];

    if (!nextStepName) {
      return null;
    }

    const step = this.steps.find((s) => s.name === nextStepName);
    return step || null;
  }

  /**
   * Método abstracto que debe implementarse en subclases
   * Ejecuta un paso específico
   */
  abstract executeStep(
    context: SagaExecutionContext,
    step: SagaStep,
  ): Promise<{ success: boolean; data?: any; error?: string }>;

  /**
   * Método abstracto que debe implementarse en subclases
   * Ejecuta la compensación de un paso
   */
  abstract compensate(
    context: SagaExecutionContext,
    step: SagaStep,
  ): Promise<{ success: boolean; error?: string }>;

  /**
   * Puede sobrescribirse en subclases para manejar eventos
   * Por defecto, no hace nada
   */
  async handleEvent(
    context: SagaExecutionContext,
    event: IDomainEvent,
  ): Promise<void> {
    // Override in subclass if needed
  }

  /**
   * Valida si la saga puede proceder
   * Por defecto, siempre retorna true
   * Puede sobrescribirse en subclases
   */
  canProceed(context: SagaExecutionContext): boolean {
    return true;
  }

  /**
   * Ayudante para obtener un paso por nombre
   */
  protected getStep(name: string): SagaStep | undefined {
    return this.steps.find((s) => s.name === name);
  }

  /**
   * Ayudante para obtener todos los pasos completados
   */
  protected getCompletedSteps(context: SagaExecutionContext): SagaStep[] {
    return this.steps.filter((s) => context.completedSteps.includes(s.name));
  }

  /**
   * Ayudante para obtener todos los pasos pendientes
   */
  protected getPendingSteps(context: SagaExecutionContext): SagaStep[] {
    return this.steps.filter((s) => context.pendingSteps.includes(s.name));
  }

  /**
   * Añade un evento al contexto
   */
  protected addEvent(context: SagaExecutionContext, event: IDomainEvent): void {
    context.events.push(event);
  }

  /**
   * Añade un error al contexto
   */
  protected addError(
    context: SagaExecutionContext,
    step: string,
    error: string,
  ): void {
    context.errors.push({
      step,
      error,
      timestamp: new Date(),
    });
  }

  /**
   * Obtiene un resumen de la saga
   */
  getSummary(): {
    name: string;
    description?: string;
    stepCount: number;
  } {
    return {
      name: this.name,
      description: this.description,
      stepCount: this.steps.length,
    };
  }
}
