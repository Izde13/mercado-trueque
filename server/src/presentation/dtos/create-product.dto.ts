import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ImagenDto {
  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://ejemplo.com/imagen.jpg',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Orden de visualización de la imagen',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  orden?: number;

  @ApiProperty({
    description: 'Indica si es la imagen principal',
    example: true,
    required: false,
  })
  @IsOptional()
  esPrincipal?: boolean;
}

export class CaracteristicaProductoDto {
  @ApiProperty({
    description: 'ID de la característica de la categoría',
    example: '880e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  @IsNotEmpty()
  caracteristicaId: string;

  @ApiProperty({
    description: 'Valor de la característica para este producto',
    example: 'M',
  })
  @IsString()
  @IsNotEmpty()
  valor: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'ID del usuario propietario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({
    description: 'ID de la categoría del producto',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

  @ApiProperty({
    description: 'ID del estado del producto',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  @IsNotEmpty()
  estadoProductoId: string;

  @ApiProperty({
    description: 'Título del producto',
    example: 'Bicicleta de montaña Trek',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Bicicleta en excelente estado, poco uso, con cambios Shimano',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    description: 'Valor estimado del producto en moneda local',
    example: 500000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valorEstimado?: number;

  @ApiProperty({
    description: 'Array de imágenes del producto (1-5 imágenes)',
    type: [ImagenDto],
    example: [
      { url: 'https://ejemplo.com/bici1.jpg', orden: 1, esPrincipal: true },
      { url: 'https://ejemplo.com/bici2.jpg', orden: 2, esPrincipal: false },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos una imagen' })
  @ArrayMaxSize(5, { message: 'No se permiten más de 5 imágenes' })
  @ValidateNested({ each: true })
  @Type(() => ImagenDto)
  imagenes: ImagenDto[];

  @ApiProperty({
    description: 'Array de características específicas del producto según su categoría',
    type: [CaracteristicaProductoDto],
    example: [
      { caracteristicaId: '880e8400-e29b-41d4-a716-446655440003', valor: 'M' },
      { caracteristicaId: '880e8400-e29b-41d4-a716-446655440004', valor: 'Azul' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CaracteristicaProductoDto)
  caracteristicas?: CaracteristicaProductoDto[];
}
