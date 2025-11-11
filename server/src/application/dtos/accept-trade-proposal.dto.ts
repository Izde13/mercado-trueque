import { IsUUID } from 'class-validator';

export class AcceptTradeProposalDto {
  @IsUUID()
  usuario_aceptante_id: string;
}

export class RejectTradeProposalDto {
  // proposal_id viene en la URL, no en el body
}

export class IntercambioResponseDto {
  id: string;
  propuesta_id: string;
  estado: string;
  fecha_inicio: Date;
  centro_distribucion_id: string;
  fecha_completado?: Date;
}
