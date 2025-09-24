import { Product } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  id: string;
  usuarioId: string;
  categoriaId: string;
  titulo: string;
  descripcion?: string;
  estadoProducto?: number;
  valorEstimado?: number;
  fechaPublicacion?: Date;
  estadoPublicacion?: string;
  imagenPrincipal?: string;
  vistas?: number;
  popularidad?: number;

  constructor(product: Product) {
    this.id = product.id;
    this.usuarioId = product.usuarioId;
    this.categoriaId = product.categoriaId;
    this.titulo = product.titulo;
    this.descripcion = product.descripcion;
    this.estadoProducto = product.estadoProducto;
    this.valorEstimado = product.valorEstimado;
    this.fechaPublicacion = product.fechaPublicacion;
    this.estadoPublicacion = product.estadoPublicacion;
    this.imagenPrincipal = product.imagenPrincipal;
    this.vistas = product.vistas;
    this.popularidad = product.popularidad;
  }
}
