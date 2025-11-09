import { Injectable } from '@nestjs/common';
import { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import {
  Intercambio,
  EstadoIntercambio,
} from '../../domain/entities/intercambio.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class IntercambioRepositoryImpl implements IntercambioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(intercambio: Intercambio): Promise<Intercambio> {
    const created = await this.prisma.intercambios.create({
      data: {
        id: intercambio.id,
        propuesta_id: intercambio.propuestaId,
        fecha_inicio: intercambio.fechaInicio,
        estado: intercambio.estado,
        centro_distribucion_id: intercambio.centroDistribucionId,
        fecha_completado: intercambio.fechaCompletado,
        notas_revision: intercambio.notasRevision,
        costo_envio_total: intercambio.costoEnvioTotal,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Intercambio | null> {
    const intercambio = await this.prisma.intercambios.findUnique({
      where: { id },
    });

    return intercambio ? this.toDomainEntity(intercambio) : null;
  }

  async findAll(): Promise<Intercambio[]> {
    const intercambios = await this.prisma.intercambios.findMany();
    return intercambios.map((i) => this.toDomainEntity(i));
  }

  async update(intercambio: Intercambio): Promise<Intercambio> {
    const updated = await this.prisma.intercambios.update({
      where: { id: intercambio.id },
      data: {
        estado: intercambio.estado,
        fecha_completado: intercambio.fechaCompletado,
        notas_revision: intercambio.notasRevision,
        costo_envio_total: intercambio.costoEnvioTotal,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.intercambios.delete({
      where: { id },
    });
  }

  async findByPropuestaId(propuestaId: string): Promise<Intercambio | null> {
    const intercambio = await this.prisma.intercambios.findFirst({
      where: { propuesta_id: propuestaId },
    });

    return intercambio ? this.toDomainEntity(intercambio) : null;
  }

  async findByEstado(estado: string): Promise<Intercambio[]> {
    const intercambios = await this.prisma.intercambios.findMany({
      where: { estado },
      orderBy: { fecha_inicio: 'desc' },
    });

    return intercambios.map((i) => this.toDomainEntity(i));
  }

  async findByCentroDistribucion(centroId: string): Promise<Intercambio[]> {
    const intercambios = await this.prisma.intercambios.findMany({
      where: { centro_distribucion_id: centroId },
      orderBy: { fecha_inicio: 'desc' },
    });

    return intercambios.map((i) => this.toDomainEntity(i));
  }

  async getStatus(id: string): Promise<string | null> {
    const intercambio = await this.prisma.intercambios.findUnique({
      where: { id },
      select: { estado: true },
    });

    return intercambio?.estado || null;
  }

  private toDomainEntity(prismaIntercambio: any): Intercambio {
    return new Intercambio(
      prismaIntercambio.id,
      prismaIntercambio.propuesta_id,
      prismaIntercambio.fecha_inicio,
      prismaIntercambio.estado as EstadoIntercambio,
      prismaIntercambio.centro_distribucion_id,
      prismaIntercambio.fecha_completado,
      prismaIntercambio.notas_revision,
      prismaIntercambio.costo_envio_total
        ? Number(prismaIntercambio.costo_envio_total)
        : undefined,
    );
  }
}
