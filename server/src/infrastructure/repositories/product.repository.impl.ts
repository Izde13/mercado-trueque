import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const created = await this.prisma.productos.create({
      data: {
        id: product.id,
        usuario_id: product.usuarioId,
        categoria_id: product.categoriaId,
        titulo: product.titulo,
        descripcion: product.descripcion,
        estado_producto: product.estadoProducto,
        valor_estimado: product.valorEstimado,
        fecha_publicacion: product.fechaPublicacion,
        estado_publicacion: product.estadoPublicacion,
        imagen_principal: product.imagenPrincipal,
        vistas: product.vistas,
        popularidad: product.popularidad,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.productos.findUnique({
      where: { id },
    });

    return product ? this.toDomainEntity(product) : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      orderBy: { fecha_publicacion: 'desc' },
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByUsuarioId(usuarioId: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { fecha_publicacion: 'desc' },
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByCategoriaId(categoriaId: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { categoria_id: categoriaId },
      orderBy: { fecha_publicacion: 'desc' },
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async findByEstadoPublicacion(estado: string): Promise<Product[]> {
    const products = await this.prisma.productos.findMany({
      where: { estado_publicacion: estado },
      orderBy: { fecha_publicacion: 'desc' },
    });

    return products.map((product) => this.toDomainEntity(product));
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.productos.update({
      where: { id: product.id },
      data: {
        titulo: product.titulo,
        descripcion: product.descripcion,
        estado_producto: product.estadoProducto,
        valor_estimado: product.valorEstimado,
        estado_publicacion: product.estadoPublicacion,
        imagen_principal: product.imagenPrincipal,
        vistas: product.vistas,
        popularidad: product.popularidad,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.productos.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaProduct: any): Product {
    return new Product(
      prismaProduct.id,
      prismaProduct.usuario_id,
      prismaProduct.categoria_id,
      prismaProduct.titulo,
      prismaProduct.descripcion,
      prismaProduct.estado_producto,
      prismaProduct.valor_estimado
        ? Number(prismaProduct.valor_estimado)
        : undefined,
      prismaProduct.fecha_publicacion,
      prismaProduct.estado_publicacion,
      prismaProduct.imagen_principal,
      prismaProduct.vistas,
      prismaProduct.popularidad,
    );
  }
}
