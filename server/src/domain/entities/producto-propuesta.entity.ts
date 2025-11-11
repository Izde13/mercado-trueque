export class ProductoPropuesta {
  constructor(
    public readonly id: string,
    public readonly propuestaId: string,
    public readonly productoId: string,
    public readonly orden: number,
  ) {
    this.validarOrden(orden);
  }

  private validarOrden(orden: number): void {
    if (orden < 1) {
      throw new Error('El orden debe ser mayor a 0');
    }
  }

  public cambiarOrden(nuevoOrden: number): ProductoPropuesta {
    return new ProductoPropuesta(
      this.id,
      this.propuestaId,
      this.productoId,
      nuevoOrden,
    );
  }

  static create(
    propuestaId: string,
    productoId: string,
    orden: number,
  ): ProductoPropuesta {
    const id = crypto.randomUUID();
    return new ProductoPropuesta(id, propuestaId, productoId, orden);
  }
}
