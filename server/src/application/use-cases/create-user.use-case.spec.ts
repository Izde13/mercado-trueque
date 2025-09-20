import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get('UserRepository');
  });

  it('should create a user', async () => {
    const name = 'John Doe';
    const email = 'john@example.com';
    const mockUser = User.create(name, email);
    userRepository.save.mockResolvedValue(mockUser);

    const result = await useCase.execute(name, email);

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name,
        email,
      }),
    );
    expect(result).toEqual(mockUser);
  });
});
