import { Injectable, Inject } from '@nestjs/common';
import { Usuario } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<Usuario[]> {
    return this.userRepository.findAll();
  }
}
