export enum EstadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly contrasena: string,
    public readonly rolId?: string,
    public readonly telefono?: string,
    public readonly fechaRegistro?: Date,
    public readonly estado?: EstadoUsuario,
    public readonly avatarUrl?: string,
    public readonly calificacionPromedio?: number,
    public readonly totalIntercambios?: number,
  ) {
    this.validarEmail(email);
    this.validarNombre(nombre);
    this.validarApellido(apellido);
    this.validarCalificacion(calificacionPromedio);
    this.validarTotalIntercambios(totalIntercambios);
  }

  private validarEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 100) {
      throw new Error('Nombre debe tener entre 1 y 100 caracteres');
    }
  }

  private validarApellido(apellido: string): void {
    if (!apellido || apellido.trim().length === 0 || apellido.length > 100) {
      throw new Error('Apellido debe tener entre 1 y 100 caracteres');
    }
  }

  private validarCalificacion(calificacion?: number): void {
    if (calificacion !== undefined && (calificacion < 0 || calificacion > 5)) {
      throw new Error('Calificación debe estar entre 0 y 5');
    }
  }

  private validarTotalIntercambios(total?: number): void {
    if (total !== undefined && total < 0) {
      throw new Error('Total de intercambios debe ser mayor o igual a 0');
    }
  }

  public get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  public estaActivo(): boolean {
    return this.estado === EstadoUsuario.ACTIVO;
  }

  public puedeIntercambiar(): boolean {
    return this.estaActivo() && (this.calificacionPromedio || 0) >= 1.0;
  }

  public actualizarCalificacion(nuevaCalificacion: number): Usuario {
    return new Usuario(
      this.id,
      this.email,
      this.nombre,
      this.apellido,
      this.contrasena,
      this.rolId,
      this.telefono,
      this.fechaRegistro,
      this.estado,
      this.avatarUrl,
      nuevaCalificacion,
      this.totalIntercambios,
    );
  }

  public incrementarIntercambios(): Usuario {
    return new Usuario(
      this.id,
      this.email,
      this.nombre,
      this.apellido,
      this.contrasena,
      this.rolId,
      this.telefono,
      this.fechaRegistro,
      this.estado,
      this.avatarUrl,
      this.calificacionPromedio,
      (this.totalIntercambios || 0) + 1,
    );
  }

  static create(
    email: string,
    nombre: string,
    apellido: string,
    contrasena: string,
    rolId?: string,
    telefono?: string,
  ): Usuario {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Usuario(
      id,
      email,
      nombre,
      apellido,
      contrasena,
      rolId,
      telefono,
      now,
      EstadoUsuario.ACTIVO,
      undefined,
      0.0,
      0,
    );
  }
}
