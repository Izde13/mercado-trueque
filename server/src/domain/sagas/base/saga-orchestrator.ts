import { Injectable, Logger } from '@nestjs/common';
import {
  ISaga,
  SagaExecutionContext,
  SagaExecutionResult,
} from './saga.interface';
import { IDomainEvent } from '../../events/base/domain-event.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Orquestador de sagas
 * Gestiona la ejecución de sagas incluyendo compensaciones en caso de fallo
 * Implementa el patrón Saga Orchestration para transacciones distribuidas
 */
@Injectable()
export class SagaOrchestrator {
  private readonly logger = new Logger(SagaOrchestrator.name);
  private registeredSagas = new Map<string, ISaga>();
  private executingContexts = new Map<string, SagaExecutionContext>();

  /**
   * Registra una saga
   */
  registerSaga(saga: ISaga): void {
    this.registeredSagas.set(saga.name, saga);
    this.logger.log(`Saga registered: ${saga.name}`);
  }

  /**
   * Obtiene una saga registrada
   */
  getSaga(sagaName: string): ISaga | undefined {
    return this.registeredSagas.get(sagaName);
  }

  /**
   * Inicia la ejecución de una saga
   * @param sagaName Nombre de la saga a ejecutar
   * @param userId Usuario que inicia la saga
   * @param data Datos iniciales
   * @param correlationId ID de correlación (se genera uno si no se proporciona)
   */
  async execute(
    sagaName: string,
    userId: string,
    data: Record<string, any>,
    correlationId?: string,
  ): Promise<SagaExecutionResult> {
    const saga = this.getSaga(sagaName);

    if (!saga) {
      throw new Error(`Saga not found: ${sagaName}`);
    }

    const startTime = Date.now();
    const executionId = uuidv4();
    const context: SagaExecutionContext = {
      executionId,
      correlationId: correlationId || uuidv4(),
      userId,
      data,
      completedSteps: [],
      pendingSteps: saga.steps.map((s) => s.name),
      events: [],
      errors: [],
      status: 'pending',
      startedAt: new Date(),
    };

    this.executingContexts.set(executionId, context);

    try {
      this.logger.log(`Starting saga execution: ${sagaName} (${executionId})`);

      context.status = 'executing';

      while (context.status === 'executing') {
        if (!saga.canProceed(context)) {
          throw new Error('Saga cannot proceed');
        }

        const nextStep = saga.getNextStep(context);

        if (!nextStep) {
          // Todos los pasos completados
          context.status = 'completed';
          break;
        }

        try {
          this.logger.debug(`Executing step: ${nextStep.name}`);
          const result = await saga.executeStep(context, nextStep);

          if (result.success) {
            context.completedSteps.push(nextStep.name);
            context.pendingSteps = context.pendingSteps.filter(
              (s) => s !== nextStep.name,
            );
          } else {
            if (nextStep.continueOnFailure) {
              context.completedSteps.push(nextStep.name);
              context.pendingSteps = context.pendingSteps.filter(
                (s) => s !== nextStep.name,
              );
              this.logger.warn(
                `Step ${nextStep.name} failed but continuing: ${result.error}`,
              );
            } else {
              throw new Error(result.error || `Step ${nextStep.name} failed`);
            }
          }
        } catch (error: any) {
          this.logger.error(`Step ${nextStep.name} failed: ${error.message}`);
          context.errors.push({
            step: nextStep.name,
            error: error.message,
            timestamp: new Date(),
          });
          context.status = 'compensating';
          break;
        }
      }

      // Si está en estado de compensación, ejecutar compensaciones
      if (context.status === 'compensating') {
        await this.compensate(context, saga);
        context.status = 'failed';
      }

      context.finishedAt = new Date();

      return {
        success: context.status === 'completed',
        context,
        errors: context.errors,
        executionTimeMs: Date.now() - startTime,
      };
    } catch (error: any) {
      this.logger.error(
        `Saga execution failed: ${sagaName} (${executionId}) - ${error.message}`,
      );

      context.status = 'failed';
      context.finishedAt = new Date();
      context.errors.push({
        step: 'saga_execution',
        error: error.message,
        timestamp: new Date(),
      });

      return {
        success: false,
        context,
        errors: context.errors,
        executionTimeMs: Date.now() - startTime,
      };
    } finally {
      // Limpiar contexto después de cierto tiempo
      setTimeout(() => {
        this.executingContexts.delete(executionId);
      }, 60000); // 1 minuto
    }
  }

  /**
   * Maneja un evento que afecta la ejecución de una saga en curso
   */
  async handleEvent(
    executionId: string,
    event: IDomainEvent,
    sagaName: string,
  ): Promise<void> {
    const context = this.executingContexts.get(executionId);

    if (!context) {
      this.logger.warn(`Context not found for execution: ${executionId}`);
      return;
    }

    const saga = this.getSaga(sagaName);

    if (!saga) {
      this.logger.warn(`Saga not found: ${sagaName}`);
      return;
    }

    try {
      await saga.handleEvent(context, event);
    } catch (error: any) {
      this.logger.error(
        `Error handling event in saga ${sagaName}: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene el contexto de una ejecución
   */
  getContext(executionId: string): SagaExecutionContext | undefined {
    return this.executingContexts.get(executionId);
  }

  /**
   * Privado: Ejecuta pasos de compensación en orden inverso
   */
  private async compensate(
    context: SagaExecutionContext,
    saga: ISaga,
  ): Promise<void> {
    this.logger.log(
      `Starting compensation for saga execution: ${context.executionId}`,
    );

    const completedStepsInOrder = saga.steps.filter((s) =>
      context.completedSteps.includes(s.name),
    );

    // Ejecutar en orden inverso
    for (let i = completedStepsInOrder.length - 1; i >= 0; i--) {
      const step = completedStepsInOrder[i];

      if (step.compensationStep) {
        try {
          this.logger.debug(`Compensating step: ${step.compensationStep.name}`);
          await saga.compensate(context, step.compensationStep);
        } catch (error: any) {
          this.logger.error(
            `Compensation failed for step ${step.name}: ${error.message}`,
          );
          context.errors.push({
            step: `compensation_${step.name}`,
            error: error.message,
            timestamp: new Date(),
          });
        }
      }
    }
  }
}
