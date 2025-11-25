import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductFiltersVO } from '../../domain/value-objects/product-filters.vo';
import { PrismaProductQueryBuilder } from '../builders/prisma-product-query.builder';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Helper para incluir características con información de la categoría
  private getIncludeWithCharacteristics() {
    return {
      imagenes_producto: true,
      caracteristicas_producto: {
        include: {
          caracteristicas_categoria: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      },
    };
  }

  async save(product: Product): Promise<Product> {
    const created = await this.prisma.productos.create({
      data: {
        id: product.id,
        usuario_id: product.usuarioId,
        categoria_id: product.categoriaId,
        titulo: product.titulo,
        descripcion: product.descripcion,
        estado_producto_id: product.estadoProductoId,
        valor_estimado: product.valorEstimado,
        fecha_publicacion: product.fechaPublicacion,
        estado_publicacion: product.estadoPublicacion,
        imagen_principal: product.imagenPrincipal,
        vistas: product.vistas,
        popularidad: product.popularidad,
        // Crear imágenes relacionadas
        imagenes_producto:
          product.imagenes && product.imagenes.length > 0
            ? {
                create: product.imagenes.map((img) => ({
                  id: img.id,
                  url_imagen: img.urlImagen,
                  orden: img.orden,
                  es_principal: img.esPrincipal,
                })),
              }
            : undefined,
      },
      include: this.getIncludeWithCharacteristics(),
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.productos.findUnique({
      where: { id },
      include: this.getIncludeWithCharacteristics(),
    });

    return product ? this.toDomainEntity(product) : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      orderBy: { fecha_publicacion: 'desc' },
      include: this.getIncludeWithCharacteristics(),
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByUsuarioId(usuarioId: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_publicacion: 'desc' },
      include: this.getIncludeWithCharacteristics(),
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByCategoriaId(categoriaId: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { categoria_id: categoriaId },
      orderBy: { fecha_publicacion: 'desc' },
      include: this.getIncludeWithCharacteristics(),
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByEstadoPublicacion(estado: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { estado_publicacion: estado },
      orderBy: { fecha_publicacion: 'desc' },
      include: this.getIncludeWithCharacteristics(),
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.productos.update({
      where: { id: product.id },
      data: {
        titulo: product.titulo,
        descripcion: product.descripcion,
        estado_producto_id: product.estadoProductoId,
        valor_estimado: product.valorEstimado,
        estado_publicacion: product.estadoPublicacion,
        imagen_principal: product.imagenPrincipal,
        vistas: product.vistas,
        popularidad: product.popularidad,
      },
      include: this.getIncludeWithCharacteristics(),
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.productos.delete({
      where: { id },
    });
  }

  /**
   * Busca productos con filtros múltiples
   * Usa el Query Builder para construir las queries complejas
   */
  async findWithFilters(filters: ProductFiltersVO): Promise<Product[]> {
    const where = PrismaProductQueryBuilder.buildWhereClause(filters);
    const include = PrismaProductQueryBuilder.buildIncludeClause(filters);

    const products = await this.prisma.productos.findMany({
      where,
      include,
      orderBy: { fecha_publicacion: 'desc' },
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async countActiveByUserId(userId: string): Promise<number> {
    return await this.prisma.productos.count({
      where: {
        usuario_id: userId,
        estado_publicacion: 'disponible',
      },
    });
  }

  async findActiveByUserId(userId: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: {
        usuario_id: userId,
        estado_publicacion: 'disponible',
      },
      orderBy: { fecha_publicacion: 'desc' },
      include: this.getIncludeWithCharacteristics(),
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  private toDomainEntity(prismaProduct: any): Product {
    const imagenes =
      prismaProduct.imagenes_producto?.map((img: any) => ({
        id: img.id,
        productoId: img.producto_id,
        urlImagen: img.url_imagen,
        orden: img.orden,
        esPrincipal: img.es_principal,
      })) || [];

    const caracteristicas =
      prismaProduct.caracteristicas_producto?.map((char: any) => ({
        id: char.id,
        productoId: char.producto_id,
        caracteristicaId: char.caracteristica_id,
        nombre: char.caracteristicas_categoria?.nombre || '',
        valor: char.valor,
      })) || [];

    return new Product(
      prismaProduct.id,
      prismaProduct.usuario_id,
      prismaProduct.categoria_id,
      prismaProduct.titulo,
      prismaProduct.estado_producto_id,
      prismaProduct.descripcion,
      prismaProduct.valor_estimado
        ? Number(prismaProduct.valor_estimado)
        : undefined,
      prismaProduct.fecha_publicacion,
      prismaProduct.estado_publicacion,
      prismaProduct.imagen_principal,
      prismaProduct.vistas,
      prismaProduct.popularidad,
      imagenes,
      caracteristicas,
    );
  }
}
