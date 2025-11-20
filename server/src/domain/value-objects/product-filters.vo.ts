/**
 * Value Object que representa los filtros de búsqueda de productos
 * Encapsula las reglas de negocio relacionadas con el filtrado
 */
export class ProductFiltersVO {
  private constructor(
    public readonly categoriaIds: string[],
    public readonly estadoProductoIds: string[],
    public readonly nombre: string | undefined,
    public readonly precioMin?: number,
    public readonly precioMax?: number,
    public readonly ubicacion?: string,
    public readonly usuarioId?: string,
    public readonly excludeUserId?: string,
    public readonly estadoPublicacion: string = 'disponible',
  ) {}

  /**
   * Factory method con validaciones de negocio
   */
  static create(params: {
    nombre?: string;
    categoriaIds?: string[];
    estadoProductoIds?: string[];
    precioMin?: number;
    precioMax?: number;
    ubicacion?: string;
    usuarioId?: string;
    excludeUserId?: string;
    estadoPublicacion?: string;
  }): ProductFiltersVO {
    // Validar reglas de negocio
    if (params.precioMin !== undefined && params.precioMin < 0) {
      throw new Error('El precio mínimo no puede ser negativo');
    }

    if (params.precioMax !== undefined && params.precioMax < 0) {
      throw new Error('El precio máximo no puede ser negativo');
    }

    if (
      params.precioMin !== undefined &&
      params.precioMax !== undefined &&
      params.precioMin > params.precioMax
    ) {
      throw new Error('El precio mínimo no puede ser mayor al precio máximo');
    }

    return new ProductFiltersVO(
      params.categoriaIds || [],
      params.estadoProductoIds || [],
      params.nombre,
      params.precioMin,
      params.precioMax,
      params.ubicacion,
      params.usuarioId,
      params.excludeUserId,
      params.estadoPublicacion || 'disponible',
    );
  }

  /**
   * Verifica si hay filtros aplicados
   */
  hasFilters(): boolean {
    return (
      this.nombre !== undefined ||
      this.categoriaIds.length > 0 ||
      this.estadoProductoIds.length > 0 ||
      this.precioMin !== undefined ||
      this.precioMax !== undefined ||
      this.ubicacion !== undefined ||
      this.usuarioId !== undefined
    );
  }

  /**
   * Verifica si hay filtros de precio
   */
  hasPriceFilter(): boolean {
    return this.precioMin !== undefined || this.precioMax !== undefined;
  }
}
