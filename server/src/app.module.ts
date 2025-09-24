import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/services/prisma.service';
import { CategoryRepositoryImpl } from './infrastructure/repositories/category.repository.impl';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from './application/use-cases/get-category.use-case';
import { CategoriesController } from './presentation/controllers/categories.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, CategoriesController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'CategoryRepository',
      useClass: CategoryRepositoryImpl,
    },
    GetCategoriesUseCase,
    GetCategoryUseCase,
  ],
})
export class AppModule {}
