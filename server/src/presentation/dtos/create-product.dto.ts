import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

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

  @IsString()
  @IsOptional()
  imagenPrincipal?: string;
}
