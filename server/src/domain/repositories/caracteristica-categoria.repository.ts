import { CaracteristicaCategoria } from '../entities/caracteristica-categoria.entity';

export interface CaracteristicaCategoriaRepository {
  save(
    caracteristica: CaracteristicaCategoria,
  ): Promise<CaracteristicaCategoria>;
  findById(id: string): Promise<CaracteristicaCategoria | null>;
  findAll(): Promise<CaracteristicaCategoria[]>;
  update(
    caracteristica: CaracteristicaCategoria,
  ): Promise<CaracteristicaCategoria>;
  delete(id: string): Promise<void>;
  findByCategoriaId(categoriaId: string): Promise<CaracteristicaCategoria[]>;
  findRequeridas(categoriaId: string): Promise<CaracteristicaCategoria[]>;
}
