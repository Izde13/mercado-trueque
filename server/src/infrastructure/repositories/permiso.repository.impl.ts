import { Injectable } from '@nestjs/common';
import { PermisoRepository } from '../../domain/repositories/permiso.repository';
import { Permiso } from '../../domain/entities/permiso.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PermisoRepositoryImpl implements PermisoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(permiso: Permiso): Promise<Permiso> {
    const created = await this.prisma.permisos.create({
      data: {
        id: permiso.id,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        creado_en: permiso.creadoEn,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Permiso | null> {
    const permiso = await this.prisma.permisos.findUnique({
      where: { id },
    });

    return permiso ? this.toDomainEntity(permiso) : null;
  }

  async findByNombre(nombre: string): Promise<Permiso | null> {
    const permiso = await this.prisma.permisos.findUnique({
      where: { nombre },
    });

    return permiso ? this.toDomainEntity(permiso) : null;
  }

  async findAll(): Promise<Permiso[]> {
    const permisos = await this.prisma.permisos.findMany({
      orderBy: { nombre: 'asc' },
    });

    return permisos.map((permiso) => this.toDomainEntity(permiso));
  }

  async update(permiso: Permiso): Promise<Permiso> {
    const updated = await this.prisma.permisos.update({
      where: { id: permiso.id },
      data: {
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permisos.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaPermiso: any): Permiso {
    return new Permiso(
      prismaPermiso.id,
      prismaPermiso.nombre,
      prismaPermiso.descripcion,
      prismaPermiso.creado_en,
    );
  }
}
