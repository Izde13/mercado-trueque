import { TradeState } from './trade-states.enum';
import { TradeEvent } from './trade-events.enum';
import {
  StateTransition,
  TransitionValidationResult,
} from './state-transition.interface';

/**
 * State Machine que gestiona el ciclo de vida completo de un trueque
 * Define todas las transiciones permitidas entre estados
 * Previene transiciones inválidas
 */
export class TradeStateMachine {
  /**
   * Tabla de transiciones: define todas las transiciones permitidas
   * Para cada estado y evento, especifica a qué estado se debe transicionar
   */
  private static readonly TRANSITIONS: StateTransition[] = [
    // ============================================
    // FASE 1: PROPUESTA
    // ============================================

    {
      from: TradeState.PROPUESTA,
      event: TradeEvent.ACCEPT,
      to: TradeState.ACEPTADA,
      validator: 'TradePhase2AcceptanceValidator',
      sideEffects: [
        'CreateIntercambio',
        'UpdateProductStatus',
        'NotifyUsers',
        'PublishProposalAcceptedEvent',
      ],
      description: 'Usuario propietario acepta la propuesta de trueque',
    },

    {
      from: TradeState.PROPUESTA,
      event: TradeEvent.REJECT,
      to: TradeState.RECHAZADA,
      sideEffects: [
        'ReleaseProducts',
        'NotifyOfferent',
        'PublishProposalRejectedEvent',
      ],
      description: 'Usuario propietario rechaza la propuesta',
    },

    {
      from: TradeState.PROPUESTA,
      event: TradeEvent.AUTO_REJECT,
      to: TradeState.AUTO_RECHAZADA,
      sideEffects: [
        'ReleaseProducts',
        'NotifyOfferent',
        'PublishProposalAutoRejectedEvent',
      ],
      description:
        'Sistema auto-rechaza propuesta después de 7 días sin respuesta',
    },

    {
      from: TradeState.PROPUESTA,
      event: TradeEvent.CANCEL,
      to: TradeState.CANCELADO,
      sideEffects: ['ReleaseProducts', 'NotifyAll'],
      description: 'Usuario oferente cancela su propia propuesta',
    },

    // ============================================
    // FASE 2: ACEPTACIÓN
    // ============================================

    {
      from: TradeState.ACEPTADA,
      event: TradeEvent.SHIP,
      to: TradeState.EN_ENVIO,
      validator: 'TradePhase3ShippingValidator',
      sideEffects: [
        'CreateShipments',
        'GenerateTrackingCodes',
        'NotifyUsers',
        'PublishProductsShippedEvent',
      ],
      description: 'Ambos usuarios confirman envío de productos',
    },

    {
      from: TradeState.ACEPTADA,
      event: TradeEvent.CANCEL,
      to: TradeState.CANCELADO,
      sideEffects: [
        'ReleaseProducts',
        'RefundShippingCosts',
        'NotifyAll',
        'PublishTradeCanceledEvent',
      ],
      description: 'Cancelar intercambio aceptado antes de envío',
    },

    // ============================================
    // FASE 3: ENVÍO
    // ============================================

    {
      from: TradeState.EN_ENVIO,
      event: TradeEvent.RECEIVE_AT_CENTER,
      to: TradeState.EN_REVISION,
      sideEffects: [
        'CreateReviewTasks',
        'AssignReviewers',
        'NotifyCenter',
        'PublishProductsReceivedEvent',
      ],
      description: 'Productos llegan al centro de distribución',
    },

    // ============================================
    // FASE 4: REVISIÓN
    // ============================================

    {
      from: TradeState.EN_REVISION,
      event: TradeEvent.REVIEW_COMPLETE,
      to: TradeState.ENTREGADO,
      validator: 'TradePhase5DeliveryValidator',
      sideEffects: [
        'GenerateShippingLabels',
        'ScheduleDelivery',
        'NotifyUsers',
        'PublishProductsReviewedEvent',
      ],
      description: 'Revisión completada, productos aprobados para entrega',
    },

    {
      from: TradeState.EN_REVISION,
      event: TradeEvent.REVIEW_REJECT,
      to: TradeState.REVISION_RECHAZADA,
      sideEffects: [
        'NotifyUsers',
        'InitiateReturnProcess',
        'PublishProductsRejectedEvent',
      ],
      description:
        'Productos rechazados en revisión por mala condición (< 3 estrellas)',
    },

    // ============================================
    // FASE 5: ENTREGA
    // ============================================

    {
      from: TradeState.ENTREGADO,
      event: TradeEvent.CONFIRM_RECEIPT,
      to: TradeState.COMPLETADO,
      validator: 'TradePhase6RatingValidator',
      sideEffects: [
        'EnableRatings',
        'UpdateUserReputation',
        'NotifyUsers',
        'PublishTradeCompletedEvent',
      ],
      description: 'Usuario confirma recepción de producto',
    },

    {
      from: TradeState.ENTREGADO,
      event: TradeEvent.AUTO_COMPLETE,
      to: TradeState.COMPLETADO,
      sideEffects: [
        'EnableRatings',
        'UpdateUserReputation',
        'PublishTradeAutoCompletedEvent',
      ],
      description: 'Sistema auto-completa después de 14 días en ENTREGADO',
    },

    // ============================================
    // FASE 6: CALIFICACIÓN
    // ============================================

    // La calificación no cambia el estado, pero podría agregar transiciones
    // futuras para estados adicionales si es necesario

    // ============================================
    // ESTADOS TERMINALES
    // ============================================

    {
      from: TradeState.RECHAZADA,
      event: TradeEvent.CANCEL,
      to: TradeState.CANCELADO,
      description: 'Cancelar después de rechazar (cleanup)',
    },

    {
      from: TradeState.AUTO_RECHAZADA,
      event: TradeEvent.CANCEL,
      to: TradeState.CANCELADO,
      description: 'Cleanup después de auto-rechazo',
    },

    {
      from: TradeState.REVISION_RECHAZADA,
      event: TradeEvent.CANCEL,
      to: TradeState.CANCELADO,
      description: 'Cleanup después de rechazo en revisión',
    },
  ];

  /**
   * Verifica si una transición de estado es válida
   * @param currentState - Estado actual del trueque
   * @param event - Evento que se quiere ejecutar
   * @returns true si la transición es permitida
   */
  static canTransition(currentState: TradeState, event: TradeEvent): boolean {
    return this.TRANSITIONS.some(
      (t) => t.from === currentState && t.event === event,
    );
  }

  /**
   * Obtiene los detalles de una transición específica
   * @param currentState - Estado actual
   * @param event - Evento a ejecutar
   * @returns StateTransition si existe, undefined si no
   */
  static getTransition(
    currentState: TradeState,
    event: TradeEvent,
  ): StateTransition | undefined {
    return this.TRANSITIONS.find(
      (t) => t.from === currentState && t.event === event,
    );
  }

  /**
   * Obtiene todos los eventos permitidos desde un estado
   * Útil para saber qué acciones puede hacer el usuario
   * @param currentState - Estado actual
   * @returns Array de eventos permitidos
   */
  static getAvailableEvents(currentState: TradeState): TradeEvent[] {
    return this.TRANSITIONS.filter((t) => t.from === currentState).map(
      (t) => t.event,
    );
  }

  /**
   * Obtiene el siguiente estado sin validar la transición
   * @param currentState - Estado actual
   * @param event - Evento
   * @returns Siguiente estado o undefined si transición no existe
   */
  static getNextState(
    currentState: TradeState,
    event: TradeEvent,
  ): TradeState | undefined {
    const transition = this.getTransition(currentState, event);
    return transition?.to;
  }

  /**
   * Valida una transición completa con detalles
   * @param currentState - Estado actual
   * @param event - Evento
   * @returns TransitionValidationResult con detalles
   */
  static validateTransition(
    currentState: TradeState,
    event: TradeEvent,
  ): TransitionValidationResult {
    const transition = this.getTransition(currentState, event);

    if (!transition) {
      return {
        isValid: false,
        message: `Transición no permitida: ${currentState} + ${event}. Estado actual no permite este evento.`,
        currentState,
        requestedEvent: event,
      };
    }

    return {
      isValid: true,
      message: `Transición válida: ${currentState} → ${transition.to}`,
      currentState,
      requestedEvent: event,
      targetState: transition.to,
    };
  }

  /**
   * Obtiene todas las transiciones posibles (útil para documentación)
   */
  static getAllTransitions(): StateTransition[] {
    return [...this.TRANSITIONS];
  }

  /**
   * Obtiene transiciones agrupadas por estado origen
   */
  static getTransitionsByState(): Map<TradeState, StateTransition[]> {
    const map = new Map<TradeState, StateTransition[]>();

    for (const transition of this.TRANSITIONS) {
      if (!map.has(transition.from)) {
        map.set(transition.from, []);
      }
      map.get(transition.from)!.push(transition);
    }

    return map;
  }

  /**
   * Verifica si un estado es terminal (no hay más transiciones posibles)
   */
  static isTerminalState(state: TradeState): boolean {
    const transitions = this.TRANSITIONS.filter((t) => t.from === state);
    return transitions.length === 0;
  }
}
