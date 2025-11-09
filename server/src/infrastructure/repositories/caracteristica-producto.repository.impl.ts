import { Injectable } from '@nestjs/common';
import { CaracteristicaProductoRepository } from '../../domain/repositories/caracteristica-producto.repository';
import { CaracteristicaProducto } from '../../domain/entities/caracteristica-producto.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CaracteristicaProductoRepositoryImpl
  implements CaracteristicaProductoRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    caracteristica: CaracteristicaProducto,
  ): Promise<CaracteristicaProducto> {
    const created = await this.prisma.caracteristicas_producto.create({
      data: {
        id: caracteristica.id,
        producto_id: caracteristica.productoId,
        caracteristica_id: caracteristica.caracteristicaId,
        valor: caracteristica.valor,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<CaracteristicaProducto | null> {
    const caracteristica =
      await this.prisma.caracteristicas_producto.findUnique({
        where: { id },
      });

    return caracteristica ? this.toDomainEntity(caracteristica) : null;
  }

  async findAll(): Promise<CaracteristicaProducto[]> {
    const caracteristicas =
      await this.prisma.caracteristicas_producto.findMany();
    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  async update(
    caracteristica: CaracteristicaProducto,
  ): Promise<CaracteristicaProducto> {
    const updated = await this.prisma.caracteristicas_producto.update({
      where: { id: caracteristica.id },
      data: {
        valor: caracteristica.valor,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.caracteristicas_producto.delete({
      where: { id },
    });
  }

  async findByProductoId(
    productoId: string,
  ): Promise<CaracteristicaProducto[]> {
    const caracteristicas = await this.prisma.caracteristicas_producto.findMany(
      {
        where: { producto_id: productoId },
      },
    );

    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  async findByCaracteristicaId(
    caracteristicaId: string,
  ): Promise<CaracteristicaProducto[]> {
    const caracteristicas = await this.prisma.caracteristicas_producto.findMany(
      {
        where: { caracteristica_id: caracteristicaId },
      },
    );

    return caracteristicas.map((c) => this.toDomainEntity(c));
  }

  private toDomainEntity(prismaCaracteristica: any): CaracteristicaProducto {
    return new CaracteristicaProducto(
      prismaCaracteristica.id,
      prismaCaracteristica.producto_id,
      prismaCaracteristica.caracteristica_id,
      prismaCaracteristica.valor,
    );
  }
}
