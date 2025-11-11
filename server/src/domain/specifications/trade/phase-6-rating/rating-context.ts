import { BaseTradeContext } from '../base/trade-context';

export interface RatingContext extends BaseTradeContext {
  intercambioId: string;
  ratedUserId: string;
  userRating: number; // 1-5
  productRating: number; // 1-5
  communicationRating?: number; // 1-5
  comment?: string;
  images?: string[];
}
