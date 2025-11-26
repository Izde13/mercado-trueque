import { IsUUID, IsString, IsOptional } from 'class-validator';

export class DeliverTradeDto {
  @IsUUID()
  usuario_id: string;

  @IsOptional()
  @IsUUID()
  intercambio_id?: string;

  @IsString()
  delivery_address: string;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class DeliveryResponseDto {
  id: string;
  intercambio_id: string;
  estado: string;
  fecha_completado: Date;
}
