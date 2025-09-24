import { ProductQuestion } from '../entities/product-question.entity';

export interface ProductQuestionRepository {
  save(question: ProductQuestion): Promise<ProductQuestion>;
  findById(id: string): Promise<ProductQuestion | null>;
  findAll(): Promise<ProductQuestion[]>;
  update(question: ProductQuestion): Promise<ProductQuestion>;
  delete(id: string): Promise<void>;
  findByProductoId(productoId: string): Promise<ProductQuestion[]>;
  findByUsuarioId(usuarioId: string): Promise<ProductQuestion[]>;
  findActive(): Promise<ProductQuestion[]>;
}
