import { Injectable } from '@nestjs/common';
import { ProductReviewRepository } from '../../domain/repositories/product-review.repository';
import {
  RevisionProducto,
  EstadoRevision,
} from '../../domain/entities/revision-producto.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ProductReviewRepositoryImpl implements ProductReviewRepository {
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

  async allApprovedForIntercambio(intercambioId: string): Promise<boolean> {
    const pendingReviews = await this.prisma.revision_productos.count({
      where: {
        intercambio_id: intercambioId,
        estado_revision: {
          not: EstadoRevision.APROBADO,
        },
      },
    });

    return pendingReviews === 0;
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
      prismaRevision.fotos_revision,
    );
  }
}
