export class CarritoTrueque {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly productoId: string,
    public readonly fechaAgregado: Date,
  ) {}

  public esReciente(): boolean {
    const ahora = new Date();
    const diferenciaDias =
      (ahora.getTime() - this.fechaAgregado.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 7;
  }

  public antiguedad(): number {
    const ahora = new Date();
    return Math.floor(
      (ahora.getTime() - this.fechaAgregado.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  static create(usuarioId: string, productoId: string): CarritoTrueque {
    const id = crypto.randomUUID();
    const now = new Date();
    return new CarritoTrueque(id, usuarioId, productoId, now);
  }
}
