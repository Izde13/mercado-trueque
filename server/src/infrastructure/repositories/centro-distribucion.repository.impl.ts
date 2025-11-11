import { Injectable } from '@nestjs/common';
import { CentroDistribucionRepository } from '../../domain/repositories/centro-distribucion.repository';
import { CentroDistribucion } from '../../domain/entities/centro-distribucion.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CentroDistribucionRepositoryImpl
  implements CentroDistribucionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(centro: CentroDistribucion): Promise<CentroDistribucion> {
    const created = await this.prisma.centros_distribucion.create({
      data: {
        id: centro.id,
        codigo: centro.codigo,
        nombre: centro.nombre,
        direccion: centro.direccion,
        ciudad: centro.ciudad,
        departamento: centro.departamento,
        telefono: centro.telefono,
        email: centro.email,
        activo: centro.activo,
        capacidad_maxima: centro.capacidadMaxima,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<CentroDistribucion | null> {
    const centro = await this.prisma.centros_distribucion.findUnique({
      where: { id },
    });

    return centro ? this.toDomainEntity(centro) : null;
  }

  async findAll(): Promise<CentroDistribucion[]> {
    const centros = await this.prisma.centros_distribucion.findMany();
    return centros.map((c) => this.toDomainEntity(c));
  }

  async update(centro: CentroDistribucion): Promise<CentroDistribucion> {
    const updated = await this.prisma.centros_distribucion.update({
      where: { id: centro.id },
      data: {
        nombre: centro.nombre,
        direccion: centro.direccion,
        ciudad: centro.ciudad,
        departamento: centro.departamento,
        telefono: centro.telefono,
        email: centro.email,
        activo: centro.activo,
        capacidad_maxima: centro.capacidadMaxima,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.centros_distribucion.delete({
      where: { id },
    });
  }

  async findByCodigo(codigo: number): Promise<CentroDistribucion | null> {
    const centro = await this.prisma.centros_distribucion.findUnique({
      where: { codigo },
    });

    return centro ? this.toDomainEntity(centro) : null;
  }

  async findActivos(): Promise<CentroDistribucion[]> {
    const centros = await this.prisma.centros_distribucion.findMany({
      where: { activo: true },
    });

    return centros.map((c) => this.toDomainEntity(c));
  }

  async findByDepartamento(
    departamento: string,
  ): Promise<CentroDistribucion[]> {
    const centros = await this.prisma.centros_distribucion.findMany({
      where: { departamento },
    });

    return centros.map((c) => this.toDomainEntity(c));
  }

  async findByCiudad(ciudad: string): Promise<CentroDistribucion[]> {
    const centros = await this.prisma.centros_distribucion.findMany({
      where: { ciudad },
    });

    return centros.map((c) => this.toDomainEntity(c));
  }

  private toDomainEntity(prismaCentro: any): CentroDistribucion {
    return new CentroDistribucion(
      prismaCentro.id,
      prismaCentro.codigo,
      prismaCentro.nombre,
      prismaCentro.direccion,
      prismaCentro.ciudad,
      prismaCentro.departamento,
      prismaCentro.activo,
      prismaCentro.capacidad_maxima,
      prismaCentro.telefono,
      prismaCentro.email,
    );
  }
}
