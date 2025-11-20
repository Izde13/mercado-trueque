import { Injectable, Inject } from '@nestjs/common';
import { Usuario, EstadoUsuario } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    estado?: EstadoUsuario,
    avatarUrl?: string,
  ): Promise<Usuario | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    const updatedUser = new Usuario(
      user.id,
      user.email,
      nombre ?? user.nombre,
      apellido ?? user.apellido,
      user.contrasena,
      user.rolId,
      telefono ?? user.telefono,
      user.fechaRegistro,
      estado ?? user.estado,
      avatarUrl ?? user.avatarUrl,
      user.calificacionPromedio,
      user.totalIntercambios,
    );
    return this.userRepository.update(updatedUser);
  }
}
