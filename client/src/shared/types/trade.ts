/**
 * Tipos y interfaces para el flujo de trueque
 */

// Producto que se muestra en propuesta
export interface TradeProduct {
  id: string;
  title: string;
  estimatedValue: number;
  mainImage: string;
  description?: string;
  checked?: boolean;
}

// Propuesta a crear
export interface CreateTradeProposalPayload {
  usuario_oferente_id: string;
  producto_solicitado_id: string;
  offered_product_ids: string[];
  message?: string;
}

// Respuesta del servidor al crear propuesta
export interface TradeProposalResponse {
  id: string;
  propuesta_id: string;
  estado: string;
  fecha_inicio: string;
  centro_distribucion_id: string;
}

// Estado de propuesta recibida
export interface ReceivedProposal {
  id: string;
  propuestaId: string;
  usuarioOferenteId: string;
  usuarioOferenteNombre: string;
  usuarioOferenteRating?: number;
  productoSolicitadoId: string;
  productoSolicitado?: TradeProduct;
  mensaje?: string;
  fechaPropuesta: string;
  estado: 'PROPUESTA' | 'ACEPTADA' | 'RECHAZADA' | 'AUTO_RECHAZADA' | 'CANCELADO';
  productosOfrecidos: TradeProduct[];
  totalValorOfrecido?: number;
  totalValorSolicitado?: number;
}

// Estado del intercambio
export type InterchangeStatus = 'INICIADO' | 'PRODUCTOS_ENVIADOS' | 'EN_REVISION' | 'COMPLETADO' | 'RECHAZADO_REVISION' | 'CANCELADO';

// Intercambio en progreso
export interface Interchange {
  id: string;
  propuesta_id: string;
  estado: InterchangeStatus;
  fecha_inicio: string;
  centro_distribucion_id: string;
  fecha_completado?: string;
  notas_revision?: string;
  costo_envio_total: number;
}
