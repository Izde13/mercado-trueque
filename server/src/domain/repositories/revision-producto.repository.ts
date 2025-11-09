import { RevisionProducto } from '../entities/revision-producto.entity';

export interface RevisionProductoRepository {
  save(revision: RevisionProducto): Promise<RevisionProducto>;
  findById(id: string): Promise<RevisionProducto | null>;
  findAll(): Promise<RevisionProducto[]>;
  update(revision: RevisionProducto): Promise<RevisionProducto>;
  delete(id: string): Promise<void>;
  findByIntercambioId(intercambioId: string): Promise<RevisionProducto[]>;
  findByProductoId(productoId: string): Promise<RevisionProducto[]>;
  findByIntercambioAndProducto(
    intercambioId: string,
    productoId: string,
  ): Promise<RevisionProducto | null>;
  findByEstado(estado: string): Promise<RevisionProducto[]>;
}
