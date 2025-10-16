import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/services/prisma.service';

// Categories
import { CategoryRepositoryImpl } from './infrastructure/repositories/category.repository.impl';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from './application/use-cases/get-category.use-case';
import { CategoriesController } from './presentation/controllers/categories.controller';

// Products
import { ProductRepositoryImpl } from './infrastructure/repositories/product.repository.impl';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ProductsController } from './presentation/controllers/products.controller';

// Users
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';

// Product Validations
import { ProductPublicationValidator } from './domain/specifications/product/product-publication.validator';
import { UserReputationLimitsRule } from './domain/specifications/product/user/user-reputation-limits.rule';
import { ForbiddenContentDetectorRule } from './domain/specifications/product/content/forbidden-content-detector.rule';
import { ActiveCategoryRule } from './domain/specifications/product/category/active-category.rule';

// Estados Producto
import { EstadosProductoController } from './presentation/controllers/estados-producto.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [
    AppController,
    CategoriesController,
    ProductsController,
    EstadosProductoController,
  ],
  providers: [
    AppService,
    PrismaService,
    // Categories
    {
      provide: 'CategoryRepository',
      useClass: CategoryRepositoryImpl,
    },
    GetCategoriesUseCase,
    GetCategoryUseCase,
    // Products
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryImpl,
    },
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductUseCase,
    // Users
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    // Product Validations
    ProductPublicationValidator,
    UserReputationLimitsRule,
    ForbiddenContentDetectorRule,
    ActiveCategoryRule,
  ],
})
export class AppModule {}
