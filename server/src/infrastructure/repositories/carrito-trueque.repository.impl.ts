import { Injectable } from '@nestjs/common';
import { CarritoTruequeRepository } from '../../domain/repositories/carrito-trueque.repository';
import { CarritoTrueque } from '../../domain/entities/carrito-trueque.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CarritoTruequeRepositoryImpl implements CarritoTruequeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(carrito: CarritoTrueque): Promise<CarritoTrueque> {
    const created = await this.prisma.carrito_trueque.create({
      data: {
        id: carrito.id,
        usuario_id: carrito.usuarioId,
        producto_id: carrito.productoId,
        fecha_agregado: carrito.fechaAgregado,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<CarritoTrueque | null> {
    const carrito = await this.prisma.carrito_trueque.findUnique({
      where: { id },
    });

    return carrito ? this.toDomainEntity(carrito) : null;
  }

  async findAll(): Promise<CarritoTrueque[]> {
    const carritos = await this.prisma.carrito_trueque.findMany();
    return carritos.map((c) => this.toDomainEntity(c));
  }

  async update(carrito: CarritoTrueque): Promise<CarritoTrueque> {
    const updated = await this.prisma.carrito_trueque.update({
      where: { id: carrito.id },
      data: {
        fecha_agregado: carrito.fechaAgregado,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.carrito_trueque.delete({
      where: { id },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<CarritoTrueque[]> {
    const carritos = await this.prisma.carrito_trueque.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_agregado: 'desc' },
    });

    return carritos.map((c) => this.toDomainEntity(c));
  }

  async findByUsuarioAndProducto(
    usuarioId: string,
    productoId: string,
  ): Promise<CarritoTrueque | null> {
    const carrito = await this.prisma.carrito_trueque.findUnique({
      where: {
        usuario_id_producto_id: {
          usuario_id: usuarioId,
          producto_id: productoId,
        },
      },
    });

    return carrito ? this.toDomainEntity(carrito) : null;
  }

  async deleteByUsuarioAndProducto(
    usuarioId: string,
    productoId: string,
  ): Promise<void> {
    await this.prisma.carrito_trueque.delete({
      where: {
        usuario_id_producto_id: {
          usuario_id: usuarioId,
          producto_id: productoId,
        },
      },
    });
  }

  async deleteAllByUsuario(usuarioId: string): Promise<void> {
    await this.prisma.carrito_trueque.deleteMany({
      where: { usuario_id: usuarioId },
    });
  }

  private toDomainEntity(prismaCarrito: any): CarritoTrueque {
    return new CarritoTrueque(
      prismaCarrito.id,
      prismaCarrito.usuario_id,
      prismaCarrito.producto_id,
      prismaCarrito.fecha_agregado,
    );
  }
}
