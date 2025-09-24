export class Location {
  constructor(
    public readonly id: string,
    public usuarioId: string,
    public direccion: string,
    public ciudad: string,
    public departamento: string,
    public nombreContacto: string,
    public codigoPostal?: string,
    public telefonoContacto?: string,
    public esPrincipal?: boolean,
    public activa?: boolean,
  ) {}

  static create(
    usuarioId: string,
    direccion: string,
    ciudad: string,
    departamento: string,
    nombreContacto: string,
    telefonoContacto?: string,
    codigoPostal?: string,
  ): Location {
    const id = crypto.randomUUID();
    return new Location(
      id,
      usuarioId,
      direccion,
      ciudad,
      departamento,
      nombreContacto,
      codigoPostal,
      telefonoContacto,
      false,
      true,
    );
  }

  update(
    direccion?: string,
    ciudad?: string,
    departamento?: string,
    codigoPostal?: string,
    nombreContacto?: string,
    telefonoContacto?: string,
    esPrincipal?: boolean,
    activa?: boolean,
  ): void {
    if (direccion) this.direccion = direccion;
    if (ciudad) this.ciudad = ciudad;
    if (departamento) this.departamento = departamento;
    if (codigoPostal !== undefined) this.codigoPostal = codigoPostal;
    if (nombreContacto) this.nombreContacto = nombreContacto;
    if (telefonoContacto !== undefined)
      this.telefonoContacto = telefonoContacto;
    if (esPrincipal !== undefined) this.esPrincipal = esPrincipal;
    if (activa !== undefined) this.activa = activa;
  }

  setAsPrincipal(): void {
    this.esPrincipal = true;
  }

  deactivate(): void {
    this.activa = false;
  }
}
