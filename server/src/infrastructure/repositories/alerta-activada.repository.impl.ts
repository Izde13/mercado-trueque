import { Injectable } from '@nestjs/common';
import { AlertaActivadaRepository } from '../../domain/repositories/alerta-activada.repository';
import { AlertaActivada } from '../../domain/entities/alerta-activada.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class AlertaActivadaRepositoryImpl implements AlertaActivadaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(alerta: AlertaActivada): Promise<AlertaActivada> {
    const created = await this.prisma.alertas_activadas.create({
      data: {
        id: alerta.id,
        suscripcion_id: alerta.suscripcionId,
        producto_id: alerta.productoId,
        enviada: alerta.enviada,
        fecha_activacion: alerta.fechaActivacion,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<AlertaActivada | null> {
    const alerta = await this.prisma.alertas_activadas.findUnique({
      where: { id },
    });

    return alerta ? this.toDomainEntity(alerta) : null;
  }

  async findAll(): Promise<AlertaActivada[]> {
    const alertas = await this.prisma.alertas_activadas.findMany();
    return alertas.map((a) => this.toDomainEntity(a));
  }

  async update(alerta: AlertaActivada): Promise<AlertaActivada> {
    const updated = await this.prisma.alertas_activadas.update({
      where: { id: alerta.id },
      data: {
        enviada: alerta.enviada,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.alertas_activadas.delete({
      where: { id },
    });
  }

  async findBySuscripcionId(suscripcionId: string): Promise<AlertaActivada[]> {
    const alertas = await this.prisma.alertas_activadas.findMany({
      where: { suscripcion_id: suscripcionId },
      orderBy: { fecha_activacion: 'desc' },
    });

    return alertas.map((a) => this.toDomainEntity(a));
  }

  async findByProductoId(productoId: string): Promise<AlertaActivada[]> {
    const alertas = await this.prisma.alertas_activadas.findMany({
      where: { producto_id: productoId },
    });

    return alertas.map((a) => this.toDomainEntity(a));
  }

  async findNoEnviadas(): Promise<AlertaActivada[]> {
    const alertas = await this.prisma.alertas_activadas.findMany({
      where: { enviada: false },
      orderBy: { fecha_activacion: 'asc' },
    });

    return alertas.map((a) => this.toDomainEntity(a));
  }

  private toDomainEntity(prismaAlerta: any): AlertaActivada {
    return new AlertaActivada(
      prismaAlerta.id,
      prismaAlerta.suscripcion_id,
      prismaAlerta.producto_id,
      prismaAlerta.enviada,
      prismaAlerta.fecha_activacion,
    );
  }
}
