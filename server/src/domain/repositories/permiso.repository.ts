import { Permiso } from '../entities/permiso.entity';

export interface PermisoRepository {
  save(permiso: Permiso): Promise<Permiso>;
  findById(id: string): Promise<Permiso | null>;
  findByNombre(nombre: string): Promise<Permiso | null>;
  findAll(): Promise<Permiso[]>;
  update(permiso: Permiso): Promise<Permiso>;
  delete(id: string): Promise<void>;
}
