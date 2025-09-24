export class TradeProposal {
  constructor(
    public readonly id: string,
    public productoSolicitadoId: string,
    public usuarioOferenteId: string,
    public mensaje?: string,
    public fechaPropuesta?: Date,
    public estado?: string,
    public fechaRespuesta?: Date,
  ) {}

  static create(
    productoSolicitadoId: string,
    usuarioOferenteId: string,
    mensaje?: string,
  ): TradeProposal {
    const id = crypto.randomUUID();
    const now = new Date();
    return new TradeProposal(
      id,
      productoSolicitadoId,
      usuarioOferenteId,
      mensaje,
      now,
      'pendiente',
      undefined,
    );
  }

  update(mensaje?: string, estado?: string): void {
    if (mensaje !== undefined) this.mensaje = mensaje;
    if (estado) this.estado = estado;
    if (estado && estado !== 'pendiente') {
      this.fechaRespuesta = new Date();
    }
  }

  accept(): void {
    this.estado = 'aceptada';
    this.fechaRespuesta = new Date();
  }

  reject(): void {
    this.estado = 'rechazada';
    this.fechaRespuesta = new Date();
  }
}
