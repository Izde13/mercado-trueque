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

export class ImagenDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsOptional()
  orden?: number;

  @IsOptional()
  esPrincipal?: boolean;
}

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

  @IsUUID()
  @IsNotEmpty()
  estadoProductoId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  valorEstimado?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos una imagen' })
  @ArrayMaxSize(5, { message: 'No se permiten más de 5 imágenes' })
  @ValidateNested({ each: true })
  @Type(() => ImagenDto)
  imagenes: ImagenDto[];
}
