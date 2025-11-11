import { Injectable, Inject } from '@nestjs/common';
import { CompositeSpecification } from '../../base/composite-specification';
import { SpecificationResult } from '../../base/specification-result';
import { ProductPublicationContext } from '../product-publication-context';
import type { CategoryRepository } from '../../../repositories/category.repository';

/**
 * Validación #7: Categoría Activa
 *
 * Reglas de negocio:
 * - La categoría seleccionada debe existir en la BD
 * - La categoría debe estar activa (activo = true)
 * - Evita publicar en categorías deprecated o eliminadas
 *
 * Valor de negocio:
 * - Mantenibilidad del catálogo
 * - Evita publicaciones en categorías obsoletas
 * - Mejora calidad de datos
 *
 * ARQUITECTURA:
 * - Depende de interfaz CategoryRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class ActiveCategoryRule extends CompositeSpecification<ProductPublicationContext> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {
    super();
  }

  async isSatisfiedBy(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult> {
    const { product } = context;

    // 1. Buscar la categoría activa
    const category = await this.categoryRepository.findActiveById(
      product.categoriaId,
    );

    // 2. Verificar que existe y está activa
    if (!category) {
      return SpecificationResult.failure(
        'La categoría seleccionada no existe o ha sido desactivada.',
        'CATEGORY_NOT_FOUND_OR_INACTIVE',
        {
          categoriaId: product.categoriaId,
        },
      );
    }

    return SpecificationResult.success();
  }
}
