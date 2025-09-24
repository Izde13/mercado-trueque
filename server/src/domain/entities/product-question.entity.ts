export class ProductQuestion {
  constructor(
    public readonly id: string,
    public productoId: string,
    public usuarioId: string,
    public pregunta: string,
    public fechaPregunta?: Date,
    public activa?: boolean,
  ) {}

  static create(
    productoId: string,
    usuarioId: string,
    pregunta: string,
  ): ProductQuestion {
    const id = crypto.randomUUID();
    const now = new Date();
    return new ProductQuestion(id, productoId, usuarioId, pregunta, now, true);
  }

  update(pregunta?: string, activa?: boolean): void {
    if (pregunta) this.pregunta = pregunta;
    if (activa !== undefined) this.activa = activa;
  }

  deactivate(): void {
    this.activa = false;
  }

  activate(): void {
    this.activa = true;
  }
}
