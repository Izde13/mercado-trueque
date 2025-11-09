import { Product } from '../entities/product.entity';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<Product[]>;
  findByCategoriaId(categoriaId: string): Promise<Product[]>;
  findByEstadoPublicacion(estado: string): Promise<Product[]>;

  /**
   * Cuenta cuántos productos activos tiene un usuario
   * Utilizado para validar límites de publicación basados en reputación
   */
  countActiveByUserId(userId: string): Promise<number>;

  /**
   * Obtiene todos los productos activos de un usuario
   */
  findActiveByUserId(userId: string): Promise<Product[]>;
}
