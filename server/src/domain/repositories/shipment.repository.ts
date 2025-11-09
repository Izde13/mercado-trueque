import { Envio } from '../entities/envio.entity';

export interface ShipmentRepository {
  save(envio: Envio): Promise<Envio>;
  findById(id: string): Promise<Envio | null>;
  findAll(): Promise<Envio[]>;
  update(envio: Envio): Promise<Envio>;
  delete(id: string): Promise<void>;
  findByIntercambioId(intercambioId: string): Promise<Envio[]>;
  hasReceivedAtCenter(
    intercambioId: string,
    productoId: string,
  ): Promise<boolean>;
}
