/**
 * Contexto base compartido por todas las validaciones de trueque
 * Contiene información común necesaria para validar cualquier fase
 */
export interface BaseTradeContext {
  // Datos del usuario realizando la acción
  userId: string;
  userStatus: 'activo' | 'inactivo';
  userRating: number;
  userTotalTrades: number;

  // Timestamp de la acción
  timestamp: Date;

  // Datos opcionales de auditoría
  requestId?: string;
  ipAddress?: string;
}

/**
 * Información de un usuario en contexto de trueque
 */
export interface TradeUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  estado: 'activo' | 'inactivo';
  calificacionPromedio: number;
  totalIntercambios: number;
  fechaRegistro: Date;
}

/**
 * Información de un producto en contexto de trueque
 */
export interface TradeProduct {
  id: string;
  ownerId: string;
  titulo: string;
  descripcion: string;
  estimatedValue: number;
  status: 'disponible' | 'en_intercambio' | 'vendido' | 'inactivo';
  estadoProductoId: string;
  categoryId: string;
  categoryName?: string;
  categoryActive?: boolean;
  createdAt: Date;
}
