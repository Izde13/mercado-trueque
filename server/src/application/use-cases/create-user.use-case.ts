import { Injectable } from '@nestjs/common';
import { Usuario } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    email: string,
    nombre: string,
    apellido: string,
    telefono?: string,
  ): Promise<Usuario> {
    const user = Usuario.create(email, nombre, apellido, telefono);
    return this.userRepository.save(user);
  }
}
