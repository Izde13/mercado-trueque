import { CaracteristicaProducto } from '../entities/caracteristica-producto.entity';

export interface CaracteristicaProductoRepository {
  save(caracteristica: CaracteristicaProducto): Promise<CaracteristicaProducto>;
  findById(id: string): Promise<CaracteristicaProducto | null>;
  findAll(): Promise<CaracteristicaProducto[]>;
  update(
    caracteristica: CaracteristicaProducto,
  ): Promise<CaracteristicaProducto>;
  delete(id: string): Promise<void>;
  findByProductoId(productoId: string): Promise<CaracteristicaProducto[]>;
  findByCaracteristicaId(
    caracteristicaId: string,
  ): Promise<CaracteristicaProducto[]>;
}
