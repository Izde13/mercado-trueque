import { CarritoTrueque } from '../entities/carrito-trueque.entity';

export interface CarritoTruequeRepository {
  save(carrito: CarritoTrueque): Promise<CarritoTrueque>;
  findById(id: string): Promise<CarritoTrueque | null>;
  findAll(): Promise<CarritoTrueque[]>;
  update(carrito: CarritoTrueque): Promise<CarritoTrueque>;
  delete(id: string): Promise<void>;
  findByUsuarioId(usuarioId: string): Promise<CarritoTrueque[]>;
  findByUsuarioAndProducto(
    usuarioId: string,
    productoId: string,
  ): Promise<CarritoTrueque | null>;
  deleteByUsuarioAndProducto(
    usuarioId: string,
    productoId: string,
  ): Promise<void>;
  deleteAllByUsuario(usuarioId: string): Promise<void>;
}
