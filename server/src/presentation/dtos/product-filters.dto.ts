import { IsOptional, IsString, IsNumberString } from 'class-validator';

/**
 * DTO para recibir filtros de productos desde query params
 * Capa de presentación - maneja la recepción de query params como strings
 * NestJS maneja automáticamente arrays cuando hay múltiples valores con el mismo key
 */
export class ProductFiltersDto {
  @IsOptional()
  categoria?: string | string[];

  @IsOptional()
  estado?: string | string[];

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsNumberString()
  precioMin?: string;

  @IsOptional()
  @IsNumberString()
  precioMax?: string;

  @IsOptional()
  @IsString()
  usuario?: string;

  @IsOptional()
  @IsString()
  estadoPublicacion?: string;
}
