import { Injectable } from '@nestjs/common';
import { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import { ProductoPropuesta } from '../../domain/entities/producto-propuesta.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ProductoPropuestaRepositoryImpl
  implements ProductoPropuestaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(productoPropuesta: ProductoPropuesta): Promise<ProductoPropuesta> {
    const created = await this.prisma.productos_propuesta.create({
      data: {
        id: productoPropuesta.id,
        propuesta_id: productoPropuesta.propuestaId,
        producto_id: productoPropuesta.productoId,
        orden: productoPropuesta.orden,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<ProductoPropuesta | null> {
    const productoPropuesta = await this.prisma.productos_propuesta.findUnique({
      where: { id },
    });

    return productoPropuesta ? this.toDomainEntity(productoPropuesta) : null;
  }

  async findAll(): Promise<ProductoPropuesta[]> {
    const productosPropuesta = await this.prisma.productos_propuesta.findMany();
    return productosPropuesta.map((p) => this.toDomainEntity(p));
  }

  async update(
    productoPropuesta: ProductoPropuesta,
  ): Promise<ProductoPropuesta> {
    const updated = await this.prisma.productos_propuesta.update({
      where: { id: productoPropuesta.id },
      data: {
        orden: productoPropuesta.orden,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.productos_propuesta.delete({
      where: { id },
    });
  }

  async findByPropuestaId(propuestaId: string): Promise<ProductoPropuesta[]> {
    const productosPropuesta = await this.prisma.productos_propuesta.findMany({
      where: { propuesta_id: propuestaId },
      orderBy: { orden: 'asc' },
    });

    return productosPropuesta.map((p) => this.toDomainEntity(p));
  }

  async findByProductoId(productoId: string): Promise<ProductoPropuesta[]> {
    const productosPropuesta = await this.prisma.productos_propuesta.findMany({
      where: { producto_id: productoId },
    });

    return productosPropuesta.map((p) => this.toDomainEntity(p));
  }

  private toDomainEntity(prismaProductoPropuesta: any): ProductoPropuesta {
    return new ProductoPropuesta(
      prismaProductoPropuesta.id,
      prismaProductoPropuesta.propuesta_id,
      prismaProductoPropuesta.producto_id,
      prismaProductoPropuesta.orden,
    );
  }
}
