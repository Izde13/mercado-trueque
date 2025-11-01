import { Product } from '../entities/product.entity';
import { ProductFiltersVO } from '../value-objects/product-filters.vo';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<Product[]>;
  findByCategoriaId(categoriaId: string): Promise<Product[]>;
  findByEstadoPublicacion(estado: string): Promise<Product[]>;
  findWithFilters(filters: ProductFiltersVO): Promise<Product[]>;
}
