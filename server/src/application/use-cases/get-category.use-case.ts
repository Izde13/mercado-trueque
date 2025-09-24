import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async executeByNombre(nombre: string): Promise<Category | null> {
    return this.categoryRepository.findByNombre(nombre);
  }
}
