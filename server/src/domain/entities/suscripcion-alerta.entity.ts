export class SuscripcionAlerta {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly activa: boolean,
    public readonly fechaSuscripcion: Date,
    public readonly categoriaId?: string,
    public readonly palabrasClave?: string,
  ) {
    this.validarEmail(email);
  }

  private validarEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  public estaActiva(): boolean {
    return this.activa;
  }

  public coincidePalabras(texto: string): boolean {
    if (!this.palabrasClave) return false;

    const palabras = this.palabrasClave
      .toLowerCase()
      .split(',')
      .map((p) => p.trim());
    const textoLower = texto.toLowerCase();

    return palabras.some((palabra) => textoLower.includes(palabra));
  }

  public activar(): SuscripcionAlerta {
    return new SuscripcionAlerta(
      this.id,
      this.email,
      true,
      this.fechaSuscripcion,
      this.categoriaId,
      this.palabrasClave,
    );
  }

  public desactivar(): SuscripcionAlerta {
    return new SuscripcionAlerta(
      this.id,
      this.email,
      false,
      this.fechaSuscripcion,
      this.categoriaId,
      this.palabrasClave,
    );
  }

  static create(
    email: string,
    categoriaId?: string,
    palabrasClave?: string,
  ): SuscripcionAlerta {
    const id = crypto.randomUUID();
    const now = new Date();
    return new SuscripcionAlerta(
      id,
      email,
      true,
      now,
      categoriaId,
      palabrasClave,
    );
  }
}
