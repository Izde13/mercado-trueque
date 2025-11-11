/**
 * Eventos que pueden ocurrir en el ciclo de vida de un trueque
 * Cada evento desencadena una transición de estado
 */
export enum TradeEvent {
  // Respuestas a propuesta
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  AUTO_REJECT = 'AUTO_REJECT',

  // Envío
  SHIP = 'SHIP',

  // Recepción en centro de distribución
  RECEIVE_AT_CENTER = 'RECEIVE_AT_CENTER',

  // Revisión
  REVIEW_COMPLETE = 'REVIEW_COMPLETE',
  REVIEW_REJECT = 'REVIEW_REJECT',

  // Entrega
  DELIVER = 'DELIVER',
  CONFIRM_RECEIPT = 'CONFIRM_RECEIPT',

  // Calificación
  RATE = 'RATE',

  // Finalización
  COMPLETE = 'COMPLETE',
  AUTO_COMPLETE = 'AUTO_COMPLETE',

  // Cancelación
  CANCEL = 'CANCEL',
}
