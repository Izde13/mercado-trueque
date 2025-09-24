export class Notification {
  constructor(
    public readonly id: string,
    public usuarioId: string,
    public tipo: string,
    public titulo: string,
    public mensaje: string,
    public leida?: boolean,
    public fechaCreacion?: Date,
    public referenciaId?: string,
    public referenciaTipo?: string,
  ) {}

  static create(
    usuarioId: string,
    tipo: string,
    titulo: string,
    mensaje: string,
    referenciaId?: string,
    referenciaTipo?: string,
  ): Notification {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Notification(
      id,
      usuarioId,
      tipo,
      titulo,
      mensaje,
      false,
      now,
      referenciaId,
      referenciaTipo,
    );
  }

  update(titulo?: string, mensaje?: string, leida?: boolean): void {
    if (titulo) this.titulo = titulo;
    if (mensaje) this.mensaje = mensaje;
    if (leida !== undefined) this.leida = leida;
  }

  markAsRead(): void {
    this.leida = true;
  }

  markAsUnread(): void {
    this.leida = false;
  }
}
