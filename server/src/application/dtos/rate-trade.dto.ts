import { IsUUID, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateTradeDto {
  @ApiProperty({
    description: 'ID del usuario que califica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  usuario_id: string;

  @ApiProperty({
    description: 'ID del intercambio completado',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  intercambio_id: string;

  @ApiProperty({
    description: 'ID del usuario que recibe la calificación',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID()
  usuario_calificado_id: string;

  @ApiProperty({
    description: 'Calificación del usuario (1-5 estrellas)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion_usuario: number;

  @ApiProperty({
    description: 'Calificación del producto recibido (1-5 estrellas)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion_producto: number;

  @ApiProperty({
    description: 'Comentario opcional sobre la experiencia',
    example: 'Excelente intercambio, producto como se describió',
    required: false,
  })
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
