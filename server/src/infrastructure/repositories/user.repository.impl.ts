import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Usuario, EstadoUsuario } from '../../domain/entities/user.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: Usuario): Promise<Usuario> {
    const created = await this.prisma.usuarios.create({
      data: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        contrasena: user.contrasena,
        rol_id: user.rolId,
        telefono: user.telefono,
        fecha_registro: user.fechaRegistro,
        estado: user.estado,
        avatar_url: user.avatarUrl,
        calificacion_promedio: user.calificacionPromedio,
        total_intercambios: user.totalIntercambios,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Usuario | null> {
    const user = await this.prisma.usuarios.findUnique({
      where: { id },
    });

    return user ? this.toDomainEntity(user) : null;
  }

  async findAll(): Promise<Usuario[]> {
    const users = await this.prisma.usuarios.findMany();
    return users.map((user) => this.toDomainEntity(user));
  }

  async update(user: Usuario): Promise<Usuario> {
    const updated = await this.prisma.usuarios.update({
      where: { id: user.id },
      data: {
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        contrasena: user.contrasena,
        rol_id: user.rolId,
        telefono: user.telefono,
        estado: user.estado,
        avatar_url: user.avatarUrl,
        calificacion_promedio: user.calificacionPromedio,
        total_intercambios: user.totalIntercambios,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.usuarios.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaUser: any): Usuario {
    return new Usuario(
      prismaUser.id,
      prismaUser.email,
      prismaUser.nombre,
      prismaUser.apellido,
      prismaUser.contrasena,
      prismaUser.rol_id,
      prismaUser.telefono,
      prismaUser.fecha_registro,
      prismaUser.estado as EstadoUsuario,
      prismaUser.avatar_url,
      prismaUser.calificacion_promedio,
      prismaUser.total_intercambios,
    );
  }

  async findByEmail(email: string) {
  return this.prisma.usuarios.findUnique({
    where: { email },
  });
}

async create(data: any) {
  return this.prisma.usuarios.create({
    data,
  });
}
}
