import { Injectable } from '@nestjs/common';
import { Usuario } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Usuario | null> {
    return this.userRepository.findById(id);
  }
}
