import { IsUUID } from 'class-validator';

export class AcceptTradeProposalDto {
  @IsUUID()
  proposal_id?: string;

  @IsUUID()
  usuario_aceptante_id: string;
}

export class RejectTradeProposalDto {
  @IsUUID()
  proposal_id: string;
}

export class IntercambioResponseDto {
  id: string;
  propuesta_id: string;
  estado: string;
  fecha_inicio: Date;
  centro_distribucion_id: string;
  fecha_completado?: Date;
}
