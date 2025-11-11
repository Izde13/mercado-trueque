import { Injectable } from '@nestjs/common';
import { EstadoProductoRepository } from '../../domain/repositories/estado-producto.repository';
import { EstadoProducto } from '../../domain/entities/estado-producto.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class EstadoProductoRepositoryImpl implements EstadoProductoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(estado: EstadoProducto): Promise<EstadoProducto> {
    const created = await this.prisma.estados_producto.create({
      data: {
        id: estado.id,
        codigo: estado.codigo,
        nombre: estado.nombre,
        descripcion: estado.descripcion,
        orden: estado.orden,
        activo: estado.activo,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<EstadoProducto | null> {
    const estado = await this.prisma.estados_producto.findUnique({
      where: { id },
    });

    return estado ? this.toDomainEntity(estado) : null;
  }

  async findAll(): Promise<EstadoProducto[]> {
    const estados = await this.prisma.estados_producto.findMany();
    return estados.map((e) => this.toDomainEntity(e));
  }

  async update(estado: EstadoProducto): Promise<EstadoProducto> {
    const updated = await this.prisma.estados_producto.update({
      where: { id: estado.id },
      data: {
        nombre: estado.nombre,
        descripcion: estado.descripcion,
        orden: estado.orden,
        activo: estado.activo,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.estados_producto.delete({
      where: { id },
    });
  }

  async findByCodigo(codigo: number): Promise<EstadoProducto | null> {
    const estado = await this.prisma.estados_producto.findUnique({
      where: { codigo },
    });

    return estado ? this.toDomainEntity(estado) : null;
  }

  async findByNombre(nombre: string): Promise<EstadoProducto | null> {
    const estado = await this.prisma.estados_producto.findUnique({
      where: { nombre },
    });

    return estado ? this.toDomainEntity(estado) : null;
  }

  async findActivos(): Promise<EstadoProducto[]> {
    const estados = await this.prisma.estados_producto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });

    return estados.map((e) => this.toDomainEntity(e));
  }

  async findAllOrdenados(): Promise<EstadoProducto[]> {
    const estados = await this.prisma.estados_producto.findMany({
      orderBy: { orden: 'asc' },
    });

    return estados.map((e) => this.toDomainEntity(e));
  }

  private toDomainEntity(prismaEstado: any): EstadoProducto {
    return new EstadoProducto(
      prismaEstado.id,
      prismaEstado.codigo,
      prismaEstado.nombre,
      prismaEstado.orden,
      prismaEstado.activo,
      prismaEstado.descripcion,
    );
  }
}
