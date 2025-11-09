export class Rol {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion?: string,
    public readonly creadoEn?: Date,
  ) {
    this.validarNombre(nombre);
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 50) {
      throw new Error('Nombre del rol debe tener entre 1 y 50 caracteres');
    }
  }

  static create(
    nombre: string,
    descripcion?: string,
  ): Rol {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Rol(
      id,
      nombre,
      descripcion,
      now,
    );
  }
}
