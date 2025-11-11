/**
 * Estados posibles de una propuesta de trueque
 * Representa el ciclo de vida completo de un intercambio
 */
export enum TradeState {
  // Estado inicial
  PROPUESTA = 'PROPUESTA',

  // Estados derivados de respuesta a propuesta
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  AUTO_RECHAZADA = 'AUTO_RECHAZADA',

  // Estados durante envío
  EN_ENVIO = 'EN_ENVIO',

  // Estados durante revisión en centro
  EN_REVISION = 'EN_REVISION',
  REVISION_RECHAZADA = 'REVISION_RECHAZADA',

  // Estados después de revisión
  ENTREGADO = 'ENTREGADO',

  // Estado final
  COMPLETADO = 'COMPLETADO',

  // Estado de cancelación
  CANCELADO = 'CANCELADO',
}
