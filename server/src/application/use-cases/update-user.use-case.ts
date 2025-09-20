import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    name?: string,
    email?: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    user.update(name, email);
    return this.userRepository.update(user);
  }
}
