import {
  IsUUID,
  IsString,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeProposalDto {
  @ApiProperty({
    description: 'ID del usuario que hace la propuesta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  usuario_oferente_id: string;

  @ApiProperty({
    description: 'IDs de los productos ofrecidos (1-5 productos)',
    example: [
      '660e8400-e29b-41d4-a716-446655440001',
      '770e8400-e29b-41d4-a716-446655440002',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  offered_product_ids: string[];

  @ApiProperty({
    description: 'ID del producto solicitado',
    example: '880e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  requested_product_id: string;

  @ApiProperty({
    description: 'Mensaje opcional para el receptor',
    example: 'Hola, me interesa tu bicicleta. ¿Aceptarías estos productos?',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(500)
  message?: string;
}

export class TradeProposalResponseDto {
  id: string;
  usuario_oferente_id: string;
  producto_solicitado_id: string;
  estado: string;
  mensaje: string;
  fecha_propuesta: Date;
  fecha_respuesta?: Date;
}
