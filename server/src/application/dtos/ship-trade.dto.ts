import { IsUUID, IsString, IsOptional } from 'class-validator';

export class ShipTradeDto {
  @IsUUID()
  usuario_id: string;

  @IsUUID()
  intercambio_id: string;

  @IsString()
  origen_direccion: string;

  @IsString()
  destino_direccion: string;

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
