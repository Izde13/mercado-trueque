export enum EstadoRevision {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  CONDICION_DIFERENTE = 'condicion_diferente',
}

export class RevisionProducto {
  constructor(
    public readonly id: string,
    public readonly intercambioId: string,
    public readonly productoId: string,
    public readonly estadoRevision: EstadoRevision,
    public readonly empleadoRevisor?: string,
    public readonly calificacionEstado?: number,
    public readonly observaciones?: string,
    public readonly fechaRevision?: Date,
    public readonly fotosRevision?: string[],
  ) {
    this.validarCalificacion(calificacionEstado);
  }

  private validarCalificacion(calificacion?: number): void {
    if (calificacion !== undefined && (calificacion < 1 || calificacion > 5)) {
      throw new Error('La calificación del estado debe estar entre 1 y 5');
    }
  }

  public estaAprobado(): boolean {
    return this.estadoRevision === EstadoRevision.APROBADO;
  }

  public estaRechazado(): boolean {
    return this.estadoRevision === EstadoRevision.RECHAZADO;
  }

  public requiereObservaciones(): boolean {
    return this.estadoRevision !== EstadoRevision.APROBADO;
  }

  public aprobar(empleado: string, calificacion: number): RevisionProducto {
    if (calificacion < 1 || calificacion > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }

    return new RevisionProducto(
      this.id,
      this.intercambioId,
      this.productoId,
      EstadoRevision.APROBADO,
      empleado,
      calificacion,
      this.observaciones,
      new Date(),
      this.fotosRevision,
    );
  }

  public rechazar(empleado: string, observaciones: string): RevisionProducto {
    if (!observaciones || observaciones.trim().length === 0) {
      throw new Error('Las observaciones son requeridas para rechazar');
    }

    return new RevisionProducto(
      this.id,
      this.intercambioId,
      this.productoId,
      EstadoRevision.RECHAZADO,
      empleado,
      this.calificacionEstado,
      observaciones,
      new Date(),
      this.fotosRevision,
    );
  }

  public agregarFotos(fotos: string[]): RevisionProducto {
    return new RevisionProducto(
      this.id,
      this.intercambioId,
      this.productoId,
      this.estadoRevision,
      this.empleadoRevisor,
      this.calificacionEstado,
      this.observaciones,
      this.fechaRevision,
      fotos,
    );
  }

  static create(intercambioId: string, productoId: string): RevisionProducto {
    const id = crypto.randomUUID();
    return new RevisionProducto(
      id,
      intercambioId,
      productoId,
      EstadoRevision.PENDIENTE,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}
