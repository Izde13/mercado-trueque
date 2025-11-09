export class AlertaActivada {
  constructor(
    public readonly id: string,
    public readonly suscripcionId: string,
    public readonly productoId: string,
    public readonly enviada: boolean,
    public readonly fechaActivacion: Date,
  ) {}

  public estaEnviada(): boolean {
    return this.enviada;
  }

  public marcarComoEnviada(): AlertaActivada {
    return new AlertaActivada(
      this.id,
      this.suscripcionId,
      this.productoId,
      true,
      this.fechaActivacion,
    );
  }

  static create(suscripcionId: string, productoId: string): AlertaActivada {
    const id = crypto.randomUUID();
    const now = new Date();
    return new AlertaActivada(id, suscripcionId, productoId, false, now);
  }
}
