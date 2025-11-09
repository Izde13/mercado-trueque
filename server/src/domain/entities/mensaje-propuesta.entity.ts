export class MensajePropuesta {
  constructor(
    public readonly id: string,
    public readonly propuestaId: string,
    public readonly usuarioId: string,
    public readonly mensaje: string,
    public readonly fechaMensaje: Date,
  ) {
    this.validarMensaje(mensaje);
  }

  private validarMensaje(mensaje: string): void {
    if (!mensaje || mensaje.trim().length === 0) {
      throw new Error('El mensaje no puede estar vacío');
    }
    if (mensaje.length > 1000) {
      throw new Error('El mensaje no puede exceder 1000 caracteres');
    }
  }

  public esReciente(): boolean {
    const ahora = new Date();
    const diferenciaDias =
      (ahora.getTime() - this.fechaMensaje.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 1;
  }

  static create(
    propuestaId: string,
    usuarioId: string,
    mensaje: string,
  ): MensajePropuesta {
    const id = crypto.randomUUID();
    const now = new Date();
    return new MensajePropuesta(id, propuestaId, usuarioId, mensaje, now);
  }
}
