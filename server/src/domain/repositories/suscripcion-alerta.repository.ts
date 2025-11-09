import { SuscripcionAlerta } from '../entities/suscripcion-alerta.entity';

export interface SuscripcionAlertaRepository {
  save(suscripcion: SuscripcionAlerta): Promise<SuscripcionAlerta>;
  findById(id: string): Promise<SuscripcionAlerta | null>;
  findAll(): Promise<SuscripcionAlerta[]>;
  update(suscripcion: SuscripcionAlerta): Promise<SuscripcionAlerta>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<SuscripcionAlerta[]>;
  findActivasByCategoria(categoriaId: string): Promise<SuscripcionAlerta[]>;
  findActivas(): Promise<SuscripcionAlerta[]>;
}
