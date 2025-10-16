import { ProductImage } from './product-image';

export class Product {
  constructor(
    public readonly id: string,
    public usuarioId: string,
    public categoriaId: string,
    public titulo: string,
    public estadoProductoId: string,
    public descripcion?: string,
    public valorEstimado?: number,
    public fechaPublicacion?: Date,
    public estadoPublicacion?: string,
    public imagenPrincipal?: string,
    public vistas?: number,
    public popularidad?: number,
    public imagenes?: ProductImage[],
  ) {}

  static create(
    usuarioId: string,
    categoriaId: string,
    estadoProductoId: string,
    titulo: string,
    descripcion?: string,
    valorEstimado?: number,
    imagenes?: ProductImage[],
  ): Product {
    const id = crypto.randomUUID();
    const now = new Date();

    // La primera imagen como principal
    const imagenPrincipal =
      imagenes && imagenes.length > 0 ? imagenes[0].urlImagen : undefined;

    return new Product(
      id,
      usuarioId,
      categoriaId,
      titulo,
      estadoProductoId,
      descripcion,
      valorEstimado,
      now,
      'disponible',
      imagenPrincipal,
      0,
      0,
      imagenes,
    );
  }

  update(
    titulo?: string,
    descripcion?: string,
    estadoProductoId?: string,
    valorEstimado?: number,
    estadoPublicacion?: string,
    imagenPrincipal?: string,
  ): void {
    if (titulo) this.titulo = titulo;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (estadoProductoId !== undefined)
      this.estadoProductoId = estadoProductoId;
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
