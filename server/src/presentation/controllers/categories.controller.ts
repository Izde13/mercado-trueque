import {
  Controller,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from '../../application/use-cases/get-category.use-case';
import { CategoryResponseDto } from '../dtos/category-response.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('active') active?: string,
  ): Promise<CategoryResponseDto[]> {
    const categories =
      active === 'true'
        ? await this.getCategoriesUseCase.executeActive()
        : await this.getCategoriesUseCase.execute();

    return categories.map((category) => new CategoryResponseDto(category));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto | null> {
    const category = await this.getCategoryUseCase.execute(id);
    return category ? new CategoryResponseDto(category) : null;
  }
}
