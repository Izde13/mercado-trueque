import { RolPermiso } from '../entities/rol-permiso.entity';

export interface RolPermisoRepository {
  save(rolPermiso: RolPermiso): Promise<RolPermiso>;
  findById(id: string): Promise<RolPermiso | null>;
  findByRolId(rolId: string): Promise<RolPermiso[]>;
  findByPermisoId(permisoId: string): Promise<RolPermiso[]>;
  findAll(): Promise<RolPermiso[]>;
  delete(id: string): Promise<void>;
  deleteByRolIdAndPermisoId(rolId: string, permisoId: string): Promise<void>;
}
