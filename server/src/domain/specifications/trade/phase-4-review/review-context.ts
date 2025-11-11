import { BaseTradeContext } from '../base/trade-context';

export interface ReviewContext extends BaseTradeContext {
  intercambioId: string;
  productoId: string;
  conditionRating: number; // 1-5
  observations?: string;
  photos?: string[];
}
