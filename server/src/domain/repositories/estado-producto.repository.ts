import { EstadoProducto } from '../entities/estado-producto.entity';

export interface EstadoProductoRepository {
  save(estado: EstadoProducto): Promise<EstadoProducto>;
  findById(id: string): Promise<EstadoProducto | null>;
  findAll(): Promise<EstadoProducto[]>;
  update(estado: EstadoProducto): Promise<EstadoProducto>;
  delete(id: string): Promise<void>;
  findByCodigo(codigo: number): Promise<EstadoProducto | null>;
  findByNombre(nombre: string): Promise<EstadoProducto | null>;
  findActivos(): Promise<EstadoProducto[]>;
  findAllOrdenados(): Promise<EstadoProducto[]>;
}
