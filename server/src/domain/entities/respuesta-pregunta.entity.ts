export class RespuestaPregunta {
  constructor(
    public readonly id: string,
    public readonly preguntaId: string,
    public readonly usuarioId: string,
    public readonly respuesta: string,
    public readonly fechaRespuesta: Date,
  ) {
    this.validarRespuesta(respuesta);
  }

  private validarRespuesta(respuesta: string): void {
    if (!respuesta || respuesta.trim().length === 0) {
      throw new Error('La respuesta no puede estar vacía');
    }
    if (respuesta.length > 1000) {
      throw new Error('La respuesta no puede exceder 1000 caracteres');
    }
  }

  public esReciente(): boolean {
    const ahora = new Date();
    const diferenciaDias =
      (ahora.getTime() - this.fechaRespuesta.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 7;
  }

  static create(
    preguntaId: string,
    usuarioId: string,
    respuesta: string,
  ): RespuestaPregunta {
    const id = crypto.randomUUID();
    const now = new Date();
    return new RespuestaPregunta(id, preguntaId, usuarioId, respuesta, now);
  }
}
