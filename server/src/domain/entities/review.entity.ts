export class Review {
  constructor(
    public readonly id: string,
    public intercambioId: string,
    public usuarioCalificadorId: string,
    public usuarioCalificadoId: string,
    public calificacionUsuario: number,
    public calificacionProducto: number,
    public comentario?: string,
    public fechaResena?: Date,
    public visible?: boolean,
  ) {}

  static create(
    intercambioId: string,
    usuarioCalificadorId: string,
    usuarioCalificadoId: string,
    calificacionUsuario: number,
    calificacionProducto: number,
    comentario?: string,
  ): Review {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Review(
      id,
      intercambioId,
      usuarioCalificadorId,
      usuarioCalificadoId,
      calificacionUsuario,
      calificacionProducto,
      comentario,
      now,
      true,
    );
  }

  update(
    calificacionUsuario?: number,
    calificacionProducto?: number,
    comentario?: string,
    visible?: boolean,
  ): void {
    if (calificacionUsuario !== undefined)
      this.calificacionUsuario = calificacionUsuario;
    if (calificacionProducto !== undefined)
      this.calificacionProducto = calificacionProducto;
    if (comentario !== undefined) this.comentario = comentario;
    if (visible !== undefined) this.visible = visible;
  }

  hide(): void {
    this.visible = false;
  }

  show(): void {
    this.visible = true;
  }
}
