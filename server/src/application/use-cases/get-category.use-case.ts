import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import type { CaracteristicaCategoriaRepository } from '../../domain/repositories/caracteristica-categoria.repository';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    @Inject('CaracteristicaCategoriaRepository')
    private readonly caracteristicaCategoriaRepository: CaracteristicaCategoriaRepository,
  ) {}

  async execute(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async executeByNombre(nombre: string): Promise<Category | null> {
    return this.categoryRepository.findByNombre(nombre);
  }

  async executeGetCharacteristics(categoriaId: string) {
    return this.caracteristicaCategoriaRepository.findByCategoriaId(
      categoriaId,
    );
  }
}
