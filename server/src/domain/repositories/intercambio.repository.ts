import { Intercambio } from '../entities/intercambio.entity';

export interface IntercambioRepository {
  save(intercambio: Intercambio): Promise<Intercambio>;
  findById(id: string): Promise<Intercambio | null>;
  findAll(): Promise<Intercambio[]>;
  update(intercambio: Intercambio): Promise<Intercambio>;
  delete(id: string): Promise<void>;
  findByPropuestaId(propuestaId: string): Promise<Intercambio | null>;
  findByEstado(estado: string): Promise<Intercambio[]>;
  findByCentroDistribucion(centroId: string): Promise<Intercambio[]>;
  getStatus(id: string): Promise<string | null>;
}
