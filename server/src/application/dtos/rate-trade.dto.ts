import { IsUUID, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class RateTradeDto {
  @IsUUID()
  usuario_id: string;

  @IsUUID()
  intercambio_id: string;

  @IsUUID()
  usuario_calificado_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion_usuario: number;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion_producto: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}

export class RatingResponseDto {
  id: string;
  intercambio_id: string;
  usuario_calificador_id: string;
  usuario_calificado_id: string;
  calificacion_usuario: number;
  calificacion_producto: number;
  comentario?: string;
  fecha_resena: Date;
}
