import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { Rol } from '../../domain/entities/role.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(role: Rol): Promise<Rol> {
    const created = await this.prisma.roles.create({
      data: {
        id: role.id,
        nombre: role.nombre,
        descripcion: role.descripcion,
        creado_en: role.creadoEn,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Rol | null> {
    const role = await this.prisma.roles.findUnique({
      where: { id },
    });

    return role ? this.toDomainEntity(role) : null;
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    const role = await this.prisma.roles.findUnique({
      where: { nombre },
    });

    return role ? this.toDomainEntity(role) : null;
  }

  async findAll(): Promise<Rol[]> {
    const roles = await this.prisma.roles.findMany({
      orderBy: { nombre: 'asc' },
    });

    return roles.map((role) => this.toDomainEntity(role));
  }

  async update(role: Rol): Promise<Rol> {
    const updated = await this.prisma.roles.update({
      where: { id: role.id },
      data: {
        nombre: role.nombre,
        descripcion: role.descripcion,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.roles.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaRole: any): Rol {
    return new Rol(
      prismaRole.id,
      prismaRole.nombre,
      prismaRole.descripcion,
      prismaRole.creado_en,
    );
  }
}
