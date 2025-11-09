import { Injectable } from '@nestjs/common';
import { SuscripcionAlertaRepository } from '../../domain/repositories/suscripcion-alerta.repository';
import { SuscripcionAlerta } from '../../domain/entities/suscripcion-alerta.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SuscripcionAlertaRepositoryImpl
  implements SuscripcionAlertaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(suscripcion: SuscripcionAlerta): Promise<SuscripcionAlerta> {
    const created = await this.prisma.suscripciones_alertas.create({
      data: {
        id: suscripcion.id,
        email: suscripcion.email,
        categoria_id: suscripcion.categoriaId,
        palabras_clave: suscripcion.palabrasClave,
        activa: suscripcion.activa,
        fecha_suscripcion: suscripcion.fechaSuscripcion,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<SuscripcionAlerta | null> {
    const suscripcion = await this.prisma.suscripciones_alertas.findUnique({
      where: { id },
    });

    return suscripcion ? this.toDomainEntity(suscripcion) : null;
  }

  async findAll(): Promise<SuscripcionAlerta[]> {
    const suscripciones = await this.prisma.suscripciones_alertas.findMany();
    return suscripciones.map((s) => this.toDomainEntity(s));
  }

  async update(suscripcion: SuscripcionAlerta): Promise<SuscripcionAlerta> {
    const updated = await this.prisma.suscripciones_alertas.update({
      where: { id: suscripcion.id },
      data: {
        email: suscripcion.email,
        categoria_id: suscripcion.categoriaId,
        palabras_clave: suscripcion.palabrasClave,
        activa: suscripcion.activa,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.suscripciones_alertas.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<SuscripcionAlerta[]> {
    const suscripciones = await this.prisma.suscripciones_alertas.findMany({
      where: { email },
      orderBy: { fecha_suscripcion: 'desc' },
    });

    return suscripciones.map((s) => this.toDomainEntity(s));
  }

  async findActivasByCategoria(
    categoriaId: string,
  ): Promise<SuscripcionAlerta[]> {
    const suscripciones = await this.prisma.suscripciones_alertas.findMany({
      where: {
        categoria_id: categoriaId,
        activa: true,
      },
    });

    return suscripciones.map((s) => this.toDomainEntity(s));
  }

  async findActivas(): Promise<SuscripcionAlerta[]> {
    const suscripciones = await this.prisma.suscripciones_alertas.findMany({
      where: { activa: true },
    });

    return suscripciones.map((s) => this.toDomainEntity(s));
  }

  private toDomainEntity(prismaSuscripcion: any): SuscripcionAlerta {
    return new SuscripcionAlerta(
      prismaSuscripcion.id,
      prismaSuscripcion.email,
      prismaSuscripcion.activa,
      prismaSuscripcion.fecha_suscripcion,
      prismaSuscripcion.categoria_id,
      prismaSuscripcion.palabras_clave,
    );
  }
}
