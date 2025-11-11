export enum EstadoEnvio {
  PREPARANDO = 'preparando',
  ENVIADO = 'enviado',
  EN_TRANSITO = 'en_transito',
  RECIBIDO_CENTRO = 'recibido_centro',
  ENTREGADO = 'entregado',
  DEVUELTO = 'devuelto',
}

export class Envio {
  constructor(
    public readonly id: string,
    public readonly intercambioId: string,
    public readonly productoId: string,
    public readonly direccionOrigen: string,
    public readonly estadoEnvio: EstadoEnvio,
    public readonly fechaEnvio?: Date,
    public readonly fechaRecepcionCentro?: Date,
    public readonly codigoTracking?: string,
    public readonly transportadora?: string,
    public readonly costoEnvio?: number,
  ) {
    this.validarDireccion(direccionOrigen);
    this.validarCosto(costoEnvio);
  }

  private validarDireccion(direccion: string): void {
    if (!direccion || direccion.trim().length === 0) {
      throw new Error('La dirección de origen es requerida');
    }
  }

  private validarCosto(costo?: number): void {
    if (costo !== undefined && costo < 0) {
      throw new Error('El costo de envío no puede ser negativo');
    }
  }

  public estaEnTransito(): boolean {
    return this.estadoEnvio === EstadoEnvio.EN_TRANSITO;
  }

  public haLlegadoAlCentro(): boolean {
    return this.estadoEnvio === EstadoEnvio.RECIBIDO_CENTRO;
  }

  public estaEntregado(): boolean {
    return this.estadoEnvio === EstadoEnvio.ENTREGADO;
  }

  public estaDevuelto(): boolean {
    return this.estadoEnvio === EstadoEnvio.DEVUELTO;
  }

  public cambiarEstado(nuevoEstado: EstadoEnvio): Envio {
    const fechaRecepcion =
      nuevoEstado === EstadoEnvio.RECIBIDO_CENTRO
        ? new Date()
        : this.fechaRecepcionCentro;

    return new Envio(
      this.id,
      this.intercambioId,
      this.productoId,
      this.direccionOrigen,
      nuevoEstado,
      this.fechaEnvio,
      fechaRecepcion,
      this.codigoTracking,
      this.transportadora,
      this.costoEnvio,
    );
  }

  public asignarTracking(codigo: string, transportadora: string): Envio {
    return new Envio(
      this.id,
      this.intercambioId,
      this.productoId,
      this.direccionOrigen,
      this.estadoEnvio,
      this.fechaEnvio,
      this.fechaRecepcionCentro,
      codigo,
      transportadora,
      this.costoEnvio,
    );
  }

  public iniciarEnvio(): Envio {
    return new Envio(
      this.id,
      this.intercambioId,
      this.productoId,
      this.direccionOrigen,
      EstadoEnvio.EN_TRANSITO,
      new Date(),
      this.fechaRecepcionCentro,
      this.codigoTracking,
      this.transportadora,
      this.costoEnvio,
    );
  }

  static create(
    intercambioId: string,
    productoId: string,
    direccionOrigen: string,
    costoEnvio?: number,
  ): Envio {
    const id = crypto.randomUUID();
    return new Envio(
      id,
      intercambioId,
      productoId,
      direccionOrigen,
      EstadoEnvio.PREPARANDO,
      undefined,
      undefined,
      undefined,
      undefined,
      costoEnvio || 0,
    );
  }
}
