import { BaseTradeContext } from '../base/trade-context';

export interface DeliveryContext extends BaseTradeContext {
  intercambioId: string;
  productoId: string;
  deliveryAddress?: string;
  estimatedDeliveryDate?: Date;
}
