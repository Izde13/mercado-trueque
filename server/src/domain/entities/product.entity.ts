export class Product {
  constructor(
    public readonly id: string,
    public usuarioId: string,
    public categoriaId: string,
    public titulo: string,
    public descripcion?: string,
    public estadoProducto?: number,
    public valorEstimado?: number,
    public fechaPublicacion?: Date,
    public estadoPublicacion?: string,
    public imagenPrincipal?: string,
    public vistas?: number,
    public popularidad?: number,
  ) {}

  static create(
    usuarioId: string,
    categoriaId: string,
    titulo: string,
    descripcion?: string,
    valorEstimado?: number,
    imagenPrincipal?: string,
  ): Product {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Product(
      id,
      usuarioId,
      categoriaId,
      titulo,
      descripcion,
      3, // default estadoProducto
      valorEstimado,
      now,
      'disponible',
      imagenPrincipal,
      0,
      0,
    );
  }

  update(
    titulo?: string,
    descripcion?: string,
    estadoProducto?: number,
    valorEstimado?: number,
    estadoPublicacion?: string,
    imagenPrincipal?: string,
  ): void {
    if (titulo) this.titulo = titulo;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (estadoProducto !== undefined) this.estadoProducto = estadoProducto;
    if (valorEstimado !== undefined) this.valorEstimado = valorEstimado;
    if (estadoPublicacion) this.estadoPublicacion = estadoPublicacion;
    if (imagenPrincipal !== undefined) this.imagenPrincipal = imagenPrincipal;
  }

  incrementVistas(): void {
    this.vistas = (this.vistas || 0) + 1;
  }

  incrementPopularidad(): void {
    this.popularidad = (this.popularidad || 0) + 1;
  }
}
