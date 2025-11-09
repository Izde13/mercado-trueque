import { TradeState } from './trade-states.enum';
import { TradeEvent } from './trade-events.enum';

/**
 * Define una transición permitida entre estados
 * Incluye validadores y side-effects asociados
 */
export interface StateTransition {
  from: TradeState;
  event: TradeEvent;
  to: TradeState;
  /**
   * Nombre del validador a ejecutar para esta transición
   * Ejemplo: 'TradePhase2AcceptanceValidator'
   */
  validator?: string;
  /**
   * Side-effects que deben ejecutarse después de la transición
   * Ejemplo: ['CreateIntercambio', 'NotifyUsers', 'UpdateProductStatus']
   */
  sideEffects?: string[];
  /**
   * Descripción de la transición (útil para logs y debugging)
   */
  description?: string;
}

/**
 * Resultado de una validación de transición de estado
 */
export interface TransitionValidationResult {
  isValid: boolean;
  message: string;
  currentState: TradeState;
  requestedEvent: TradeEvent;
  targetState?: TradeState;
}
