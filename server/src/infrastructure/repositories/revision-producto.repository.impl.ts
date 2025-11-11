import { Injectable } from '@nestjs/common';
import { RevisionProductoRepository } from '../../domain/repositories/revision-producto.repository';
import {
  RevisionProducto,
  EstadoRevision,
} from '../../domain/entities/revision-producto.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RevisionProductoRepositoryImpl
  implements RevisionProductoRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(revision: RevisionProducto): Promise<RevisionProducto> {
    const created = await this.prisma.revision_productos.create({
      data: {
        id: revision.id,
        intercambio_id: revision.intercambioId,
        producto_id: revision.productoId,
        estado_revision: revision.estadoRevision,
        empleado_revisor: revision.empleadoRevisor,
        calificacion_estado: revision.calificacionEstado,
        observaciones: revision.observaciones,
        fecha_revision: revision.fechaRevision,
        fotos_revision: revision.fotosRevision,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<RevisionProducto | null> {
    const revision = await this.prisma.revision_productos.findUnique({
      where: { id },
    });

    return revision ? this.toDomainEntity(revision) : null;
  }

  async findAll(): Promise<RevisionProducto[]> {
    const revisiones = await this.prisma.revision_productos.findMany();
    return revisiones.map((r) => this.toDomainEntity(r));
  }

  async update(revision: RevisionProducto): Promise<RevisionProducto> {
    const updated = await this.prisma.revision_productos.update({
      where: { id: revision.id },
      data: {
        estado_revision: revision.estadoRevision,
        empleado_revisor: revision.empleadoRevisor,
        calificacion_estado: revision.calificacionEstado,
        observaciones: revision.observaciones,
        fecha_revision: revision.fechaRevision,
        fotos_revision: revision.fotosRevision,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.revision_productos.delete({
      where: { id },
    });
  }

  async findByIntercambioId(
    intercambioId: string,
  ): Promise<RevisionProducto[]> {
    const revisiones = await this.prisma.revision_productos.findMany({
      where: { intercambio_id: intercambioId },
    });

    return revisiones.map((r) => this.toDomainEntity(r));
  }

  async findByProductoId(productoId: string): Promise<RevisionProducto[]> {
    const revisiones = await this.prisma.revision_productos.findMany({
      where: { producto_id: productoId },
    });

    return revisiones.map((r) => this.toDomainEntity(r));
  }

  async findByIntercambioAndProducto(
    intercambioId: string,
    productoId: string,
  ): Promise<RevisionProducto | null> {
    const revision = await this.prisma.revision_productos.findUnique({
      where: {
        intercambio_id_producto_id: {
          intercambio_id: intercambioId,
          producto_id: productoId,
        },
      },
    });

    return revision ? this.toDomainEntity(revision) : null;
  }

  async findByEstado(estado: string): Promise<RevisionProducto[]> {
    const revisiones = await this.prisma.revision_productos.findMany({
      where: { estado_revision: estado },
    });

    return revisiones.map((r) => this.toDomainEntity(r));
  }

  private toDomainEntity(prismaRevision: any): RevisionProducto {
    return new RevisionProducto(
      prismaRevision.id,
      prismaRevision.intercambio_id,
      prismaRevision.producto_id,
      prismaRevision.estado_revision as EstadoRevision,
      prismaRevision.empleado_revisor,
      prismaRevision.calificacion_estado,
      prismaRevision.observaciones,
      prismaRevision.fecha_revision,
      prismaRevision.fotos_revision
        ? (prismaRevision.fotos_revision as string[])
        : undefined,
    );
  }
}
