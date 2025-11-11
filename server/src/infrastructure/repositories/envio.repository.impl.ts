import { Injectable } from '@nestjs/common';
import { EnvioRepository } from '../../domain/repositories/envio.repository';
import { Envio, EstadoEnvio } from '../../domain/entities/envio.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class EnvioRepositoryImpl implements EnvioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(envio: Envio): Promise<Envio> {
    const created = await this.prisma.envios.create({
      data: {
        id: envio.id,
        intercambio_id: envio.intercambioId,
        producto_id: envio.productoId,
        direccion_origen: envio.direccionOrigen,
        estado_envio: envio.estadoEnvio,
        fecha_envio: envio.fechaEnvio,
        fecha_recepcion_centro: envio.fechaRecepcionCentro,
        codigo_tracking: envio.codigoTracking,
        transportadora: envio.transportadora,
        costo_envio: envio.costoEnvio,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Envio | null> {
    const envio = await this.prisma.envios.findUnique({
      where: { id },
    });

    return envio ? this.toDomainEntity(envio) : null;
  }

  async findAll(): Promise<Envio[]> {
    const envios = await this.prisma.envios.findMany();
    return envios.map((e) => this.toDomainEntity(e));
  }

  async update(envio: Envio): Promise<Envio> {
    const updated = await this.prisma.envios.update({
      where: { id: envio.id },
      data: {
        estado_envio: envio.estadoEnvio,
        fecha_envio: envio.fechaEnvio,
        fecha_recepcion_centro: envio.fechaRecepcionCentro,
        codigo_tracking: envio.codigoTracking,
        transportadora: envio.transportadora,
        costo_envio: envio.costoEnvio,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.envios.delete({
      where: { id },
    });
  }

  async findByIntercambioId(intercambioId: string): Promise<Envio[]> {
    const envios = await this.prisma.envios.findMany({
      where: { intercambio_id: intercambioId },
    });

    return envios.map((e) => this.toDomainEntity(e));
  }

  async findByProductoId(productoId: string): Promise<Envio[]> {
    const envios = await this.prisma.envios.findMany({
      where: { producto_id: productoId },
    });

    return envios.map((e) => this.toDomainEntity(e));
  }

  async findByCodigoTracking(codigo: string): Promise<Envio | null> {
    const envio = await this.prisma.envios.findFirst({
      where: { codigo_tracking: codigo },
    });

    return envio ? this.toDomainEntity(envio) : null;
  }

  async findByEstado(estado: string): Promise<Envio[]> {
    const envios = await this.prisma.envios.findMany({
      where: { estado_envio: estado },
    });

    return envios.map((e) => this.toDomainEntity(e));
  }

  private toDomainEntity(prismaEnvio: any): Envio {
    return new Envio(
      prismaEnvio.id,
      prismaEnvio.intercambio_id,
      prismaEnvio.producto_id,
      prismaEnvio.direccion_origen,
      prismaEnvio.estado_envio as EstadoEnvio,
      prismaEnvio.fecha_envio,
      prismaEnvio.fecha_recepcion_centro,
      prismaEnvio.codigo_tracking,
      prismaEnvio.transportadora,
      prismaEnvio.costo_envio ? Number(prismaEnvio.costo_envio) : undefined,
    );
  }
}
