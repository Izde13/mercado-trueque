import { BaseTradeContext } from '../base/trade-context';

/**
 * Contexto específico para FASE 2: ACEPTACIÓN
 */
export interface AcceptanceContext extends BaseTradeContext {
  proposalId: string;
  proposal: {
    id: string;
    status: string;
    createdAt: Date;
    requestedProductOwnerId: string;
    offerentId: string;
    offeredProductCount: number;
  };
  products?: {
    offeredCount: number;
    requestedCount: number;
    allActive: boolean;
  };
  intercambio?: {
    id: string;
    centroDistribucionId?: string;
  };
}
