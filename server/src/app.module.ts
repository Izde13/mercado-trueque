import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './infrastructure/models/user.model';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'mercado_trueque',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([UserModel]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    CreateUserUseCase,
    GetUserUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class AppModule {}
