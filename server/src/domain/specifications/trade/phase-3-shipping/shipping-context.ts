import { BaseTradeContext } from '../base/trade-context';

export interface ShippingContext extends BaseTradeContext {
  intercambioId: string;
  intercambio: {
    id: string;
    estado: string;
    createdAt: Date;
  };
  shippingAddresses?: {
    origin: string;
    destination: string;
  };
}
