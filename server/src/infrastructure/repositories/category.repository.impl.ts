import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Category } from '../../domain/entities/category.entity';
import type { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(category: Category): Promise<Category> {
    const created = await this.prisma.categorias.create({
      data: {
        id: category.id,
        codigo: category.codigo,
        nombre: category.nombre,
        descripcion: category.descripcion,
        activo: category.activo,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.categorias.findUnique({
      where: { id },
    });

    return category ? this.toDomainEntity(category) : null;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });

    return categories.map((category) => this.toDomainEntity(category));
  }

  async findActive(): Promise<Category[]> {
    const categories = await this.prisma.categorias.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });

    return categories.map((category) => this.toDomainEntity(category));
  }

  async findByNombre(nombre: string): Promise<Category | null> {
    const category = await this.prisma.categorias.findUnique({
      where: { nombre },
    });

    return category ? this.toDomainEntity(category) : null;
  }

  async update(category: Category): Promise<Category> {
    const updated = await this.prisma.categorias.update({
      where: { id: category.id },
      data: {
        codigo: category.codigo,
        nombre: category.nombre,
        descripcion: category.descripcion,
        activo: category.activo,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.categorias.delete({
      where: { id },
    });
  }

  private toDomainEntity(prismaCategory: any): Category {
    return new Category(
      prismaCategory.id,
      prismaCategory.codigo,
      prismaCategory.nombre,
      prismaCategory.descripcion,
      prismaCategory.activo,
    );
  }
}
