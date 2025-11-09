import { RevisionProducto } from '../entities/revision-producto.entity';

export interface ProductReviewRepository {
  save(revision: RevisionProducto): Promise<RevisionProducto>;
  findById(id: string): Promise<RevisionProducto | null>;
  findAll(): Promise<RevisionProducto[]>;
  update(revision: RevisionProducto): Promise<RevisionProducto>;
  delete(id: string): Promise<void>;
  findByIntercambioId(intercambioId: string): Promise<RevisionProducto[]>;
  allApprovedForIntercambio(intercambioId: string): Promise<boolean>;
}
