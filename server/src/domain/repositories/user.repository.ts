import { Usuario } from '../entities/user.entity';

export interface UserRepository {
  save(user: Usuario): Promise<Usuario>;
  findById(id: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  update(user: Usuario): Promise<Usuario>;
  delete(id: string): Promise<void>;
}
