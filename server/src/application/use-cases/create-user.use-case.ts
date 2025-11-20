import { Injectable, Inject } from '@nestjs/common';
import { Usuario } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    email: string,
    nombre: string,
    apellido: string,
    contrasena: string,
    telefono?: string,
    rolId?: string,
  ): Promise<Usuario> {
    const user = Usuario.create(
      email,
      nombre,
      apellido,
      contrasena,
      rolId,
      telefono,
    );
    return this.userRepository.save(user);
  }
}
