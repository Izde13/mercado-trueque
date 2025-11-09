export enum EstadoIntercambio {
  INICIADO = 'iniciado',
  PRODUCTOS_ENVIADOS = 'productos_enviados',
  EN_REVISION = 'en_revision',
  COMPLETADO = 'completado',
  RECHAZADO_REVISION = 'rechazado_revision',
  CANCELADO = 'cancelado',
}

export class Intercambio {
  constructor(
    public readonly id: string,
    public readonly propuestaId: string,
    public readonly fechaInicio: Date,
    public readonly estado: EstadoIntercambio,
    public readonly centroDistribucionId: string,
    public readonly fechaCompletado?: Date,
    public readonly notasRevision?: string,
    public readonly costoEnvioTotal?: number,
  ) {
    this.validarCostoEnvio(costoEnvioTotal);
  }

  private validarCostoEnvio(costo?: number): void {
    if (costo !== undefined && costo < 0) {
      throw new Error('El costo de envío no puede ser negativo');
    }
  }

  public estaCompletado(): boolean {
    return this.estado === EstadoIntercambio.COMPLETADO;
  }

  public estaCancelado(): boolean {
    return this.estado === EstadoIntercambio.CANCELADO;
  }

  public puedeRevisarse(): boolean {
    return this.estado === EstadoIntercambio.PRODUCTOS_ENVIADOS;
  }

  public puedeEntregarse(): boolean {
    return this.estado === EstadoIntercambio.EN_REVISION;
  }

  public cambiarEstado(nuevoEstado: EstadoIntercambio): Intercambio {
    return new Intercambio(
      this.id,
      this.propuestaId,
      this.fechaInicio,
      nuevoEstado,
      this.centroDistribucionId,
      nuevoEstado === EstadoIntercambio.COMPLETADO
        ? new Date()
        : this.fechaCompletado,
      this.notasRevision,
      this.costoEnvioTotal,
    );
  }

  public agregarNotasRevision(notas: string): Intercambio {
    return new Intercambio(
      this.id,
      this.propuestaId,
      this.fechaInicio,
      this.estado,
      this.centroDistribucionId,
      this.fechaCompletado,
      notas,
      this.costoEnvioTotal,
    );
  }

  public actualizarCostoEnvio(costo: number): Intercambio {
    return new Intercambio(
      this.id,
      this.propuestaId,
      this.fechaInicio,
      this.estado,
      this.centroDistribucionId,
      this.fechaCompletado,
      this.notasRevision,
      costo,
    );
  }

  static create(
    propuestaId: string,
    centroDistribucionId: string,
  ): Intercambio {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Intercambio(
      id,
      propuestaId,
      now,
      EstadoIntercambio.INICIADO,
      centroDistribucionId,
      undefined,
      undefined,
      0,
    );
  }
}
