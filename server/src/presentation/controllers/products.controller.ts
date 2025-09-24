import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(
      createProductDto.usuarioId,
      createProductDto.categoriaId,
      createProductDto.titulo,
      createProductDto.descripcion,
      createProductDto.valorEstimado,
      createProductDto.imagenPrincipal,
    );

    return new ProductResponseDto(product);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('categoria') categoriaId?: string,
    @Query('usuario') usuarioId?: string,
    @Query('estado') estado?: string,
  ): Promise<ProductResponseDto[]> {
    let products;

    if (categoriaId) {
      products = await this.getProductsUseCase.executeByCategory(categoriaId);
    } else if (usuarioId) {
      products = await this.getProductsUseCase.executeByUser(usuarioId);
    } else if (estado) {
      products = await this.getProductsUseCase.executeByStatus(estado);
    } else {
      products = await this.getProductsUseCase.execute();
    }

    return products.map((product) => new ProductResponseDto(product));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto | null> {
    const product = await this.getProductUseCase.execute(id);
    return product ? new ProductResponseDto(product) : null;
  }
}
