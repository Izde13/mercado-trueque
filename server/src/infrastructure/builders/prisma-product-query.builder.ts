import { ProductFiltersVO } from '../../domain/value-objects/product-filters.vo';

/**
 * Query Builder para Prisma
 * Infraestructura - Encapsula la construcción de queries complejas
 */
export class PrismaProductQueryBuilder {
  /**
   * Construye el objeto WHERE de Prisma basado en los filtros
   */
  static buildWhereClause(filters: ProductFiltersVO): any {
    const where: any = {
      estado_publicacion: filters.estadoPublicacion,
    };

    this.addNameFilter(where, filters);
    this.addCategoriesFilter(where, filters);
    this.addProductStatusFilter(where, filters);
    this.addPriceRangeFilter(where, filters);
    this.addLocationFilter(where, filters);
    this.addUserFilter(where, filters);

    return where;
  }

  /**
   * Construye el objeto INCLUDE de Prisma para las relaciones
   */
  static buildIncludeClause(filters: ProductFiltersVO): any {
    return {
      imagenes_producto: true,
      categorias: true,
      estados_producto: true,
      usuarios: filters.ubicacion
        ? {
            include: {
              ubicaciones: {
                where: { activa: true },
              },
            },
          }
        : false,
    };
  }

  private static addNameFilter(where: any, filters: ProductFiltersVO): void {
    if (filters.nombre) {
      where.titulo = {
        contains: filters.nombre,
        mode: 'insensitive',
      };
    }
  }

  private static addCategoriesFilter(
    where: any,
    filters: ProductFiltersVO,
  ): void {
    if (filters.categoriaIds.length > 0) {
      where.categorias = {
        nombre: {
          in: filters.categoriaIds,
        },
      };
    }
  }

  private static addProductStatusFilter(where: any, filters: ProductFiltersVO): void {
    if (filters.estadoProductoIds.length > 0) {
      where.estados_producto = {
        nombre: {
          in: filters.estadoProductoIds,
        },
      };
    }
  }

  private static addPriceRangeFilter(where: any, filters: ProductFiltersVO): void {
    if (filters.hasPriceFilter()) {
      where.valor_estimado = {};

      if (filters.precioMin !== undefined) {
        where.valor_estimado.gte = filters.precioMin;
      }

      if (filters.precioMax !== undefined) {
        where.valor_estimado.lte = filters.precioMax;
      }
    }
  }

  private static addLocationFilter(where: any, filters: ProductFiltersVO): void {
    if (filters.ubicacion) {
      where.usuarios = {
        ubicaciones: {
          some: {
            activa: true,
            OR: [
              {
                ciudad: {
                  contains: filters.ubicacion,
                  mode: 'insensitive',
                },
              },
              {
                departamento: {
                  contains: filters.ubicacion,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      };
    }
  }

  private static addUserFilter(where: any, filters: ProductFiltersVO): void {
    if (filters.usuarioId) {
      where.usuario_id = filters.usuarioId;
    }
  }
}
