import { Category } from '../entities/category.entity';

export interface CategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  findByNombre(nombre: string): Promise<Category | null>;
  findActive(): Promise<Category[]>;
}
