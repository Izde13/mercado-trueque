import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para recibir filtros de productos desde query params
 * Capa de presentación - maneja la recepción de query params como strings
 * NestJS maneja automáticamente arrays cuando hay múltiples valores con el mismo key
 */
export class ProductFiltersDto {
  @ApiPropertyOptional({
    description: 'Buscar productos por nombre (búsqueda parcial)',
    example: 'Bicicleta',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description:
      'ID(s) de categoría para filtrar productos. Para un solo valor usa: categoria=Deportes. Para múltiples valores usa: categoria=Deportes&categoria=Tecnologia',
    example: ['Deportes', 'Tecnologia'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  categoria?: string | string[];

  @ApiPropertyOptional({
    description:
      'ID(s) de estado del producto para filtrar. Para un solo valor usa: estado=Nuevo. Para múltiples valores usa: estado=Nuevo&estado=Usado',
    example: ['Nuevo', 'Usado'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  estado?: string | string[];

  @ApiPropertyOptional({
    description: 'Ubicación/dirección para filtrar productos cercanos',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @ApiPropertyOptional({
    description: 'Precio mínimo estimado del producto',
    example: '100',
  })
  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @ApiPropertyOptional({
    description: 'Precio máximo estimado del producto',
    example: '5000',
  })
  @IsOptional()
  @IsNumberString()
  precioMax?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario propietario para filtrar sus productos',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  usuario?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario a excluir de los resultados (para no mostrar productos propios)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  excludeUserId?: string;

  @ApiPropertyOptional({
    description: 'Estado de publicación del producto',
    example: 'disponible',
  })
  @IsOptional()
  @IsString()
  estadoPublicacion?: string;
}
