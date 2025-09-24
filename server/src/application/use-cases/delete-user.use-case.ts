import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
