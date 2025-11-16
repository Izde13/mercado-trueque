import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/services/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener los roles de un usuario desde BD
   * @param usuarioId - ID del usuario
   * @returns Array de nombres de roles del usuario
   */
  async getRolesByUserId(usuarioId: string): Promise<string[]> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      include: {
        roles: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!usuario || !usuario.roles) {
      return [];
    }

    return [usuario.roles.nombre];
  }

  /**
   * Obtener todos los roles disponibles en el sistema
   */
  async getAllRoles(): Promise<any[]> {
    return await this.prisma.roles.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
    });
  }

  /**
   * Obtener un rol específico con sus permisos
   */
  async getRoleWithPermissions(roleName: string): Promise<any | null> {
    return await this.prisma.roles.findUnique({
      where: { nombre: roleName },
      include: {
        rol_permisos: {
          include: {
            permisos: {
              select: {
                nombre: true,
                descripcion: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Asignar un rol a un usuario
   */
  async assignRoleToUser(usuarioId: string, roleName: string): Promise<any> {
    // Obtener el ID del rol
    const rol = await this.prisma.roles.findUnique({
      where: { nombre: roleName },
    });

    if (!rol) {
      throw new Error(`Rol "${roleName}" no existe`);
    }

    // Actualizar el usuario con el rol
    return await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { rol_id: rol.id },
      include: { roles: true },
    });
  }

  /**
   * Crear un nuevo rol
   */
  async createRole(nombre: string, descripcion?: string): Promise<any> {
    return await this.prisma.roles.create({
      data: {
        nombre,
        descripcion,
      },
    });
  }

  /**
   * Remover rol de un usuario (asignar null)
   */
  async removeRoleFromUser(usuarioId: string): Promise<any> {
    return await this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { rol_id: null },
    });
  }
}
