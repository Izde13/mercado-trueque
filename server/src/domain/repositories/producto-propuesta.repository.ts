import { ProductoPropuesta } from '../entities/producto-propuesta.entity';

export interface ProductoPropuestaRepository {
  save(productoPropuesta: ProductoPropuesta): Promise<ProductoPropuesta>;
  findById(id: string): Promise<ProductoPropuesta | null>;
  findAll(): Promise<ProductoPropuesta[]>;
  update(productoPropuesta: ProductoPropuesta): Promise<ProductoPropuesta>;
  delete(id: string): Promise<void>;
  findByPropuestaId(propuestaId: string): Promise<ProductoPropuesta[]>;
  findByProductoId(productoId: string): Promise<ProductoPropuesta[]>;
}
