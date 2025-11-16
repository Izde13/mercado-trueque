export class NotificationResponseDto {
  id: string;
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fechaCreacion?: Date;
  referenciaId?: string;
  referenciaTipo?: string;
}
