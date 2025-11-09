import { Rol } from '../entities/role.entity';

export interface RoleRepository {
  save(role: Rol): Promise<Rol>;
  findById(id: string): Promise<Rol | null>;
  findByNombre(nombre: string): Promise<Rol | null>;
  findAll(): Promise<Rol[]>;
  update(role: Rol): Promise<Rol>;
  delete(id: string): Promise<void>;
}
