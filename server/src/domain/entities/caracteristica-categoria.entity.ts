export enum TipoDatoCaracteristica {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  SELECT = 'select',
}

export class CaracteristicaCategoria {
  constructor(
    public readonly id: string,
    public readonly categoriaId: string,
    public readonly nombre: string,
    public readonly tipoDato: TipoDatoCaracteristica,
    public readonly requerido: boolean,
    public readonly opciones?: any,
  ) {
    this.validarNombre(nombre);
    this.validarOpciones();
  }

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0 || nombre.length > 50) {
      throw new Error('El nombre debe tener entre 1 y 50 caracteres');
    }
  }

  private validarOpciones(): void {
    if (this.tipoDato === TipoDatoCaracteristica.SELECT && !this.opciones) {
      throw new Error('Las opciones son requeridas para tipo SELECT');
    }
  }

  public esRequerido(): boolean {
    return this.requerido;
  }

  public validarValor(valor: any): boolean {
    if (this.requerido && !valor) {
      return false;
    }

    switch (this.tipoDato) {
      case TipoDatoCaracteristica.NUMBER:
        return !isNaN(Number(valor));
      case TipoDatoCaracteristica.BOOLEAN:
        return (
          typeof valor === 'boolean' || valor === 'true' || valor === 'false'
        );
      case TipoDatoCaracteristica.SELECT:
        return (
          this.opciones &&
          Array.isArray(this.opciones) &&
          this.opciones.includes(valor)
        );
      default:
        return true;
    }
  }

  static create(
    categoriaId: string,
    nombre: string,
    tipoDato: TipoDatoCaracteristica,
    requerido: boolean,
    opciones?: any,
  ): CaracteristicaCategoria {
    const id = crypto.randomUUID();
    return new CaracteristicaCategoria(
      id,
      categoriaId,
      nombre,
      tipoDato,
      requerido,
      opciones,
    );
  }
}
