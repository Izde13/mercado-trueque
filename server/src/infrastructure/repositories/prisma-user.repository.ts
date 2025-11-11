import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PrismaUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuarios.findUnique({
      where: { email },
      include: { roles: true },
    });
  }

  async create(data: {
    email: string;
    nombre: string;
    apellido: string;
    contrasena: string;
    rol_id?: string;
  }) {
    return this.prisma.usuarios.create({
      data: {
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        contrasena: data.contrasena,
        rol_id: data.rol_id,
      },
      include: { roles: true },
    });
  }
}
