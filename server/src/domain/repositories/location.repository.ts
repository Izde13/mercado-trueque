import { Location } from '../entities/location.entity';

export interface LocationRepository {
  save(location: Location): Promise<Location>;
  findById(id: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  update(location: Location): Promise<Location>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<Location[]>;
  findPrincipalByUsuarioId(usuarioId: string): Promise<Location | null>;
  findActiveByUsuarioId(usuarioId: string): Promise<Location[]>;
}
