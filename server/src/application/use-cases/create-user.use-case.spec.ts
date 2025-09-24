import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { Usuario } from '../../domain/entities/user.entity';
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
    const email = 'john@example.com';
    const nombre = 'John';
    const apellido = 'Doe';
    const mockUser = Usuario.create(email, nombre, apellido);
    userRepository.save.mockResolvedValue(mockUser);

    const result = await useCase.execute(email, nombre, apellido);

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email,
        nombre,
        apellido,
      }),
    );
    expect(result).toEqual(mockUser);
  });
});
