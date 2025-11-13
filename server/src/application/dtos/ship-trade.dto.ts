import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShipTradeDto {
  @ApiProperty({
    description: 'ID del usuario que envía',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  usuario_id: string;

  @ApiProperty({
    description: 'ID del intercambio',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  intercambio_id: string;

  @ApiProperty({
    description: 'Dirección de origen del envío',
    example: 'Calle 123 #45-67, Bogotá',
  })
  @IsString()
  origen_direccion: string;

  @ApiProperty({
    description: 'Dirección de destino (centro de distribución)',
    example: 'Centro Distribución Norte, Av. 68 #80-90',
  })
  @IsString()
  destino_direccion: string;

  @ApiProperty({
    description: 'Notas adicionales sobre el envío',
    example: 'Productos bien empaquetados en caja de cartón',
    required: false,
  })
  @IsOptional()
  @IsString()
  notas?: string;
}

export class ShippingResponseDto {
  id: string;
  intercambio_id: string;
  producto_id: string;
  estado: string;
  codigo_rastreo?: string;
  origen_direccion: string;
  destino_direccion: string;
  fecha_envio: Date;
  fecha_entrega_estimada?: Date;
}
