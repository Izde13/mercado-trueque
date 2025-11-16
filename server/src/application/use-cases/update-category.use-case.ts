import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import type { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    id: string,
    nombre?: string,
    descripcion?: string,
    activo?: boolean,
  ): Promise<Category> {
    // Validar que la categoría exista
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    // Validar nombre si se proporciona
    if (nombre && nombre.trim().length === 0) {
      throw new BadRequestException(
        'El nombre de la categoría no puede estar vacío',
      );
    }

    // Validar que no exista otra categoría con el mismo nombre
    if (nombre && nombre.trim() !== existingCategory.nombre) {
      const duplicated = await this.categoryRepository.findByNombre(
        nombre.trim(),
      );
      if (duplicated) {
        throw new BadRequestException(
          `Ya existe una categoría con el nombre "${nombre}"`,
        );
      }
    }

    // Actualizar solo los campos que se proporcionen
    const updatedCategory = new Category(
      existingCategory.id,
      existingCategory.codigo,
      nombre ? nombre.trim() : existingCategory.nombre,
      descripcion !== undefined
        ? descripcion?.trim() || undefined
        : existingCategory.descripcion,
      activo !== undefined ? activo : existingCategory.activo,
    );

    // Guardar cambios
    const result = await this.categoryRepository.update(updatedCategory);

    return result;
  }
}
