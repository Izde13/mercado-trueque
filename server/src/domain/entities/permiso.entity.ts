export class Permiso {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion?: string,
    public readonly creadoEn?: Date,
  ) {
    this.validarNombre(nombre);
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 100) {
      throw new Error('Nombre del permiso debe tener entre 1 y 100 caracteres');
    }
  }

  static create(
    nombre: string,
    descripcion?: string,
  ): Permiso {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Permiso(
      id,
      nombre,
      descripcion,
      now,
    );
  }
}
