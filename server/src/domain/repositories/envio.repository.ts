import { Envio } from '../entities/envio.entity';

export interface EnvioRepository {
  save(envio: Envio): Promise<Envio>;
  findById(id: string): Promise<Envio | null>;
  findAll(): Promise<Envio[]>;
  update(envio: Envio): Promise<Envio>;
  delete(id: string): Promise<void>;
  findByIntercambioId(intercambioId: string): Promise<Envio[]>;
  findByProductoId(productoId: string): Promise<Envio[]>;
  findByCodigoTracking(codigo: string): Promise<Envio | null>;
  findByEstado(estado: string): Promise<Envio[]>;
}
