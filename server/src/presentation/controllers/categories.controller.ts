import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from '../../application/use-cases/get-category.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  /**
   * GET /categories
   * Endpoint público - no requiere autenticación
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Endpoint público para listar categorías',
  })
  async findAll(
    @Query('active') active?: string,
  ): Promise<CategoryResponseDto[]> {
    const categories =
      active === 'true'
        ? await this.getCategoriesUseCase.executeActive()
        : await this.getCategoriesUseCase.execute();

    return categories.map((category) => new CategoryResponseDto(category));
  }

  /**
   * GET /categories/:id
   * Endpoint público - no requiere autenticación
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description: 'Endpoint público para obtener una categoría específica',
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto | null> {
    const category = await this.getCategoryUseCase.execute(id);
    return category ? new CategoryResponseDto(category) : null;
  }

  /**
   * POST /categories
   * Solo: admin
   * Crear una nueva categoría
   */
  @Post()
  @Auth('admin')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva categoría',
    description: 'Solo admins pueden crear categorías',
  })
  async create(
    @Body() body: { nombre: string; descripcion?: string },
    @CurrentUser() user: any,
  ) {
    try {
      const categoria = await this.createCategoryUseCase.execute(
        body.nombre,
        body.descripcion,
      );

      return {
        message: 'Categoría creada exitosamente',
        data: new CategoryResponseDto(categoria),
        creado_por: user.email,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * PUT /categories/:id
   * Solo: admin
   * Actualizar una categoría existente
   */
  @Put(':id')
  @Auth('admin')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar categoría',
    description: 'Solo admins pueden actualizar categorías',
  })
  async update(
    @Param('id') id: string,
    @Body() body: { nombre?: string; descripcion?: string; activo?: boolean },
    @CurrentUser() user: any,
  ) {
    try {
      const categoriaActualizada = await this.updateCategoryUseCase.execute(
        id,
        body.nombre,
        body.descripcion,
        body.activo,
      );

      return {
        message: 'Categoría actualizada exitosamente',
        data: new CategoryResponseDto(categoriaActualizada),
        actualizado_por: user.email,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
