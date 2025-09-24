export class Category {
  constructor(
    public readonly id: string,
    public codigo: number,
    public nombre: string,
    public descripcion?: string,
    public activo?: boolean,
  ) {}

  static create(nombre: string, descripcion?: string): Category {
    const id = crypto.randomUUID();
    return new Category(id, 0, nombre, descripcion, true);
  }

  update(nombre?: string, descripcion?: string, activo?: boolean): void {
    if (nombre) this.nombre = nombre;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (activo !== undefined) this.activo = activo;
  }

  deactivate(): void {
    this.activo = false;
  }

  activate(): void {
    this.activo = true;
  }
}
