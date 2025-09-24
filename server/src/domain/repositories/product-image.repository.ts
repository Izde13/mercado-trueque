import { ProductImage } from '../entities/product-image.entity';

export interface ProductImageRepository {
  save(image: ProductImage): Promise<ProductImage>;
  findById(id: string): Promise<ProductImage | null>;
  findAll(): Promise<ProductImage[]>;
  update(image: ProductImage): Promise<ProductImage>;
  delete(id: string): Promise<void>;
  findByProductoId(productoId: string): Promise<ProductImage[]>;
  findPrincipalByProductoId(productoId: string): Promise<ProductImage | null>;
}
