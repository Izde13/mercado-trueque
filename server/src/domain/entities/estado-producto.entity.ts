export class EstadoProducto {
  constructor(
    public readonly id: string,
    public readonly codigo: number,
    public readonly nombre: string,
    public readonly orden: number,
    public readonly activo: boolean,
    public readonly descripcion?: string,
  ) {
    this.validarNombre(nombre);
    this.validarOrden(orden);
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 50) {
      throw new Error('El nombre debe tener entre 1 y 50 caracteres');
    }
  }

  private validarOrden(orden: number): void {
    if (orden < 1) {
      throw new Error('El orden debe ser mayor a 0');
    }
  }

  public estaActivo(): boolean {
    return this.activo;
  }

  public activar(): EstadoProducto {
    return new EstadoProducto(
      this.id,
      this.codigo,
      this.nombre,
      this.orden,
      true,
      this.descripcion,
    );
  }

  public desactivar(): EstadoProducto {
    return new EstadoProducto(
      this.id,
      this.codigo,
      this.nombre,
      this.orden,
      false,
      this.descripcion,
    );
  }

  static create(
    codigo: number,
    nombre: string,
    orden: number,
    descripcion?: string,
  ): EstadoProducto {
    const id = crypto.randomUUID();
    return new EstadoProducto(id, codigo, nombre, orden, true, descripcion);
  }
}
