import {
  IsUUID,
  IsInt,
  IsString,
  IsArray,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class ReviewProductDto {
  @IsUUID()
  intercambio_id: string;

  @IsUUID()
  producto_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  condition_rating: number;

  @IsOptional()
  @IsString()
  @MinLength(20)
  observations?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class ReviewResponseDto {
  id: string;
  intercambio_id: string;
  producto_id: string;
  calificacion_producto?: number;
  estado_revision: string;
  fecha_revision: Date;
}
