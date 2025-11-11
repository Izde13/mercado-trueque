import {
  BaseTradeContext,
  TradeProduct,
  TradeUser,
} from '../base/trade-context';

/**
 * Contexto específico para FASE 1: PROPUESTA
 * Contiene toda la información necesaria para validar una propuesta de trueque
 */
export interface ProposalContext extends BaseTradeContext {
  // Usuario que está haciendo la propuesta (oferente)
  offerent: TradeUser;

  // Productos que el oferente quiere ofrecer
  offeredProducts: TradeProduct[];

  // Productos que el oferente quiere recibir (solicitados)
  requestedProducts: TradeProduct[];

  // Mensaje opcional de la propuesta
  message?: string;

  // Cálculos útiles (pueden pre-calcularse)
  totalOfferedValue?: number;
  totalRequestedValue?: number;
  valueBalance?: number; // Diferencia entre valores
}

/**
 * Factory para crear un contexto de propuesta
 */
export class ProposalContextFactory {
  static create(data: {
    userId: string;
    offerent: TradeUser;
    offeredProducts: TradeProduct[];
    requestedProducts: TradeProduct[];
    message?: string;
  }): ProposalContext {
    const totalOfferedValue = data.offeredProducts.reduce(
      (sum, p) => sum + p.estimatedValue,
      0,
    );
    const totalRequestedValue = data.requestedProducts.reduce(
      (sum, p) => sum + p.estimatedValue,
      0,
    );
    const valueBalance = totalOfferedValue - totalRequestedValue;

    return {
      userId: data.userId,
      userStatus: data.offerent.estado as 'activo' | 'inactivo',
      userRating: data.offerent.calificacionPromedio,
      userTotalTrades: data.offerent.totalIntercambios,
      timestamp: new Date(),
      offerent: data.offerent,
      offeredProducts: data.offeredProducts,
      requestedProducts: data.requestedProducts,
      message: data.message,
      totalOfferedValue,
      totalRequestedValue,
      valueBalance,
    };
  }
}
