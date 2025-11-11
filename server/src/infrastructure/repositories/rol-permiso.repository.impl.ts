import { Injectable } from '@nestjs/common';
import { RolPermisoRepository } from '../../domain/repositories/rol-permiso.repository';
import { RolPermiso } from '../../domain/entities/rol-permiso.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RolPermisoRepositoryImpl implements RolPermisoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(rolPermiso: RolPermiso): Promise<RolPermiso> {
    const created = await this.prisma.rol_permisos.create({
      data: {
        id: rolPermiso.id,
        rol_id: rolPermiso.rolId,
        permiso_id: rolPermiso.permisoId,
        creado_en: rolPermiso.creadoEn,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<RolPermiso | null> {
    const rolPermiso = await this.prisma.rol_permisos.findUnique({
      where: { id },
    });

    return rolPermiso ? this.toDomainEntity(rolPermiso) : null;
  }

  async findByRolId(rolId: string): Promise<RolPermiso[]> {
    const rolPermisos = await this.prisma.rol_permisos.findMany({
      where: { rol_id: rolId },
      orderBy: { creado_en: 'desc' },
    });

    return rolPermisos.map((rolPermiso) => this.toDomainEntity(rolPermiso));
  }

  async findByPermisoId(permisoId: string): Promise<RolPermiso[]> {
    const rolPermisos = await this.prisma.rol_permisos.findMany({
      where: { permiso_id: permisoId },
      orderBy: { creado_en: 'desc' },
    });

    return rolPermisos.map((rolPermiso) => this.toDomainEntity(rolPermiso));
  }

  async findAll(): Promise<RolPermiso[]> {
    const rolPermisos = await this.prisma.rol_permisos.findMany({
      orderBy: { creado_en: 'desc' },
    });

    return rolPermisos.map((rolPermiso) => this.toDomainEntity(rolPermiso));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rol_permisos.delete({
      where: { id },
    });
  }

  async deleteByRolIdAndPermisoId(rolId: string, permisoId: string): Promise<void> {
    await this.prisma.rol_permisos.deleteMany({
      where: {
        rol_id: rolId,
        permiso_id: permisoId,
      },
    });
  }

  private toDomainEntity(prismaRolPermiso: any): RolPermiso {
    return new RolPermiso(
      prismaRolPermiso.id,
      prismaRolPermiso.rol_id,
      prismaRolPermiso.permiso_id,
      prismaRolPermiso.creado_en,
    );
  }
}
