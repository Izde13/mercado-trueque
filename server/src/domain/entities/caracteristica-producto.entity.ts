export class CaracteristicaProducto {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly caracteristicaId: string,
    public readonly valor: string,
  ) {
    this.validarValor(valor);
  }

  private validarValor(valor: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new Error('El valor de la característica no puede estar vacío');
    }
  }

  public actualizarValor(nuevoValor: string): CaracteristicaProducto {
    return new CaracteristicaProducto(
      this.id,
      this.productoId,
      this.caracteristicaId,
      nuevoValor,
    );
  }

  static create(
    productoId: string,
    caracteristicaId: string,
    valor: string,
  ): CaracteristicaProducto {
    const id = crypto.randomUUID();
    return new CaracteristicaProducto(id, productoId, caracteristicaId, valor);
  }
}
