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
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { GetProductUseCase } from '../../application/use-cases/get-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductFiltersDto } from '../dtos/product-filters.dto';
import { BusinessRuleException } from '../../domain/errors';
import { ProductFiltersVO } from '../../domain/value-objects/product-filters.vo';

// Response wrapper interface for OWASP compliance
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  requestId?: string;
}

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<ApiResponse<ProductResponseDto>> {
    const requestId = this.generateRequestId();

    try {
      // Security logging - Log product creation attempt (without sensitive data)
      this.logger.log(
        `Product creation attempt - User: ${this.sanitizeForLog(createProductDto.usuarioId)}, ` +
          `Category: ${this.sanitizeForLog(createProductDto.categoriaId)}, RequestId: ${requestId}`,
      );

      const product = await this.createProductUseCase.execute(
        createProductDto.usuarioId,
        createProductDto.categoriaId,
        createProductDto.estadoProductoId,
        createProductDto.titulo,
        createProductDto.imagenes,
        createProductDto.descripcion,
        createProductDto.valorEstimado,
      );

      const response = new ProductResponseDto(product);

      // Success logging
      this.logger.log(
        `Product created successfully - ID: ${product.id}, User: ${this.sanitizeForLog(createProductDto.usuarioId)}, RequestId: ${requestId}`,
      );

      return {
        success: true,
        message: 'Producto creado exitosamente',
        data: response,
        timestamp: new Date().toISOString(),
        requestId,
      };
    } catch (error) {
      // Security logging for errors
      this.logger.error(
        `Product creation failed - User: ${this.sanitizeForLog(createProductDto.usuarioId)}, ` +
          `Error: ${error.message}, RequestId: ${requestId}`,
        error.stack,
      );

      // Si es una excepción de regla de negocio, dejar que el filtro global la maneje
      if (error instanceof BusinessRuleException) {
        throw error;
      }

      // Para otros errores, convertir en InternalServerErrorException
      throw new InternalServerErrorException({
        success: false,
        message: 'Error interno del servidor al crear el producto',
        timestamp: new Date().toISOString(),
        requestId,
      });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filtersDto: ProductFiltersDto,
  ): Promise<ProductResponseDto[]> {
    const requestId = this.generateRequestId();

    try {
      let products;

      // Si hay filtros, crear el Value Object y ejecutar con filtros
      const hasFilters =
        (filtersDto.categoria && filtersDto.categoria.length > 0) ||
        (filtersDto.estado && filtersDto.estado.length > 0) ||
        filtersDto.ubicacion ||
        filtersDto.precioMin ||
        filtersDto.precioMax ||
        filtersDto.usuario ||
        filtersDto.estadoPublicacion;

      if (hasFilters) {
        // Normalizar arrays (NestJS envía string si es único, array si son múltiples)
        const categoriaIds = filtersDto.categoria
          ? Array.isArray(filtersDto.categoria)
            ? filtersDto.categoria
            : [filtersDto.categoria]
          : undefined;

        const estadoProductoIds = filtersDto.estado
          ? Array.isArray(filtersDto.estado)
            ? filtersDto.estado
            : [filtersDto.estado]
          : undefined;

        // El Value Object se encarga de las validaciones
        const filters = ProductFiltersVO.create({
          categoriaIds,
          estadoProductoIds,
          ubicacion: filtersDto.ubicacion,
          precioMin: filtersDto.precioMin
            ? parseFloat(filtersDto.precioMin)
            : undefined,
          precioMax: filtersDto.precioMax
            ? parseFloat(filtersDto.precioMax)
            : undefined,
          usuarioId: filtersDto.usuario,
          estadoPublicacion: filtersDto.estadoPublicacion,
        });

        products = await this.getProductsUseCase.executeWithFilters(filters);
      } else {
        products = await this.getProductsUseCase.execute();
      }

      return products.map((product) => new ProductResponseDto(product));
    } catch (error) {
      this.logger.error(
        `Error fetching products - RequestId: ${requestId}, Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error al obtener productos');
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto | null> {
    const product = await this.getProductUseCase.execute(id);
    return product ? new ProductResponseDto(product) : null;
  }

  // Helper methods for OWASP compliance

  /**
   * Generate a unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize data for logging to prevent log injection attacks
   * Follows OWASP A09 - Security Logging and Monitoring Failures
   */
  private sanitizeForLog(input: any): string {
    if (!input) return 'undefined';

    return String(input)
      .replace(/[\r\n\t]/g, '_') // Remove line breaks and tabs
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 50); // Limit length to prevent log flooding
  }
}
