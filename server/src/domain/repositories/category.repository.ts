import { Category } from '../entities/category.entity';

export interface CategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  findByNombre(nombre: string): Promise<Category | null>;
  findActive(): Promise<Category[]>;

  /**
   * Obtiene una categoría por ID y verifica que esté activa
   * Retorna null si no existe o no está activa
   */
  findActiveById(id: string): Promise<Category | null>;
}
