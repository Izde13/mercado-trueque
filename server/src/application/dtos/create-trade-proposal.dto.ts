import {
  IsUUID,
  IsString,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTradeProposalDto {
  @IsUUID()
  usuario_oferente_id: string;

  @IsArray()
  @IsUUID('all', { each: true })
  offered_product_ids: string[];

  @IsUUID()
  requested_product_id: string;

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
