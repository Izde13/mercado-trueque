export class CentroDistribucion {
  constructor(
    public readonly id: string,
    public readonly codigo: number,
    public readonly nombre: string,
    public readonly direccion: string,
    public readonly ciudad: string,
    public readonly departamento: string,
    public readonly activo: boolean,
    public readonly capacidadMaxima: number,
    public readonly telefono?: string,
    public readonly email?: string,
  ) {
    this.validarNombre(nombre);
    this.validarDireccion(direccion);
    this.validarCapacidad(capacidadMaxima);
    this.validarEmail(email);
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 100) {
      throw new Error('El nombre debe tener entre 1 y 100 caracteres');
    }
  }

  private validarDireccion(direccion: string): void {
    if (!direccion || direccion.trim().length === 0) {
      throw new Error('La dirección es requerida');
    }
  }

  private validarCapacidad(capacidad: number): void {
    if (capacidad <= 0) {
      throw new Error('La capacidad debe ser mayor a 0');
    }
  }

  private validarEmail(email?: string): void {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
    }
  }

  public estaActivo(): boolean {
    return this.activo;
  }

  public tieneCapacidad(intercambiosActuales: number): boolean {
    return this.activo && intercambiosActuales < this.capacidadMaxima;
  }

  public activar(): CentroDistribucion {
    return new CentroDistribucion(
      this.id,
      this.codigo,
      this.nombre,
      this.direccion,
      this.ciudad,
      this.departamento,
      true,
      this.capacidadMaxima,
      this.telefono,
      this.email,
    );
  }

  public desactivar(): CentroDistribucion {
    return new CentroDistribucion(
      this.id,
      this.codigo,
      this.nombre,
      this.direccion,
      this.ciudad,
      this.departamento,
      false,
      this.capacidadMaxima,
      this.telefono,
      this.email,
    );
  }

  static create(
    codigo: number,
    nombre: string,
    direccion: string,
    ciudad: string,
    departamento: string,
    capacidadMaxima: number,
    telefono?: string,
    email?: string,
  ): CentroDistribucion {
    const id = crypto.randomUUID();
    return new CentroDistribucion(
      id,
      codigo,
      nombre,
      direccion,
      ciudad,
      departamento,
      true,
      capacidadMaxima,
      telefono,
      email,
    );
  }
}
