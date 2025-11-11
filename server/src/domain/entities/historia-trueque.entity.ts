export class HistoriaTrueque {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly titulo: string,
    public readonly historia: string,
    public readonly fechaPublicacion: Date,
    public readonly activa: boolean,
    public readonly imagenUrl?: string,
  ) {
    this.validarTitulo(titulo);
    this.validarHistoria(historia);
  }

  private validarTitulo(titulo: string): void {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('El título no puede estar vacío');
    }
    if (titulo.length > 200) {
      throw new Error('El título no puede exceder 200 caracteres');
    }
  }

  private validarHistoria(historia: string): void {
    if (!historia || historia.trim().length === 0) {
      throw new Error('La historia no puede estar vacía');
    }
  }

  public estaActiva(): boolean {
    return this.activa;
  }

  public activar(): HistoriaTrueque {
    return new HistoriaTrueque(
      this.id,
      this.usuarioId,
      this.titulo,
      this.historia,
      this.fechaPublicacion,
      true,
      this.imagenUrl,
    );
  }

  public desactivar(): HistoriaTrueque {
    return new HistoriaTrueque(
      this.id,
      this.usuarioId,
      this.titulo,
      this.historia,
      this.fechaPublicacion,
      false,
      this.imagenUrl,
    );
  }

  static create(
    usuarioId: string,
    titulo: string,
    historia: string,
    imagenUrl?: string,
  ): HistoriaTrueque {
    const id = crypto.randomUUID();
    const now = new Date();
    return new HistoriaTrueque(
      id,
      usuarioId,
      titulo,
      historia,
      now,
      true,
      imagenUrl,
    );
  }
}
