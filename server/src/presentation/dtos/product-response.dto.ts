import { Product } from '../../domain/entities/product.entity';

export class CaracteristicaProductoResponseDto {
  id: string;
  caracteristicaId: string;
  nombre: string;
  valor: string;
}

export class ProductResponseDto {
  id: string;
  usuarioId: string;
  categoriaId: string;
  titulo: string;
  descripcion?: string;
  estadoProductoId: string;
  valorEstimado?: number;
  fechaPublicacion?: Date;
  estadoPublicacion?: string;
  imagenPrincipal?: string;
  vistas?: number;
  popularidad?: number;
  imagenes?: Array<{
    id: string;
    urlImagen: string;
    orden: number;
    esPrincipal: boolean;
  }>;
  caracteristicas?: CaracteristicaProductoResponseDto[];

  constructor(product: Product) {
    this.id = product.id;
    this.usuarioId = product.usuarioId;
    this.categoriaId = product.categoriaId;
    this.titulo = product.titulo;
    this.descripcion = product.descripcion;
    this.estadoProductoId = product.estadoProductoId;
    this.valorEstimado = product.valorEstimado;
    this.fechaPublicacion = product.fechaPublicacion;
    this.estadoPublicacion = product.estadoPublicacion;
    this.imagenPrincipal = product.imagenPrincipal;
    this.vistas = product.vistas;
    this.popularidad = product.popularidad;
    this.imagenes = product.imagenes;

    // Mapear características con información de la categoría
    if (product.caracteristicas && product.caracteristicas.length > 0) {
      this.caracteristicas = product.caracteristicas.map((char) => ({
        id: char.id,
        caracteristicaId: char.caracteristicaId,
        nombre: char.nombre || '',
        valor: char.valor,
      }));
    }
  }
}
