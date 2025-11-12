import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    nombre: string,
    descripcion?: string,
  ): Promise<Category> {
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim().length === 0) {
      throw new BadRequestException('El nombre de la categoría es requerido');
    }

    // Validar que la categoría no exista ya
    const existingCategory = await this.categoryRepository.findByNombre(
      nombre.trim(),
    );
    if (existingCategory) {
      throw new BadRequestException(
        `Ya existe una categoría con el nombre "${nombre}"`,
      );
    }

    // Crear nueva categoría
    const newCategory = new Category(
      uuidv4(), // id
      0, // codigo será generado por la BD
      nombre.trim(),
      descripcion?.trim(),
      true, // activo por defecto
    );

    // Guardar en BD
    const createdCategory = await this.categoryRepository.save(newCategory);

    return createdCategory;
  }
}
