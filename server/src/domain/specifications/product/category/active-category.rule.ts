import { Injectable, Inject } from '@nestjs/common';
import { CompositeSpecification } from '../../base/composite-specification';
import { SpecificationResult } from '../../base/specification-result';
import { ProductPublicationContext } from '../product-publication-context';
import { PrismaService } from '../../../../infrastructure/services/prisma.service';

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
 */
@Injectable()
export class ActiveCategoryRule extends CompositeSpecification<ProductPublicationContext> {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async isSatisfiedBy(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult> {
    const { product } = context;

    // 1. Buscar la categoría
    const category = await this.prisma.categorias.findUnique({
      where: { id: product.categoriaId },
      select: {
        id: true,
        nombre: true,
        activo: true,
        descripcion: true,
      },
    });

    // 2. Verificar que existe
    if (!category) {
      return SpecificationResult.failure(
        'La categoría seleccionada no existe.',
        'CATEGORY_NOT_FOUND',
        {
          categoriaId: product.categoriaId,
        },
      );
    }

    // 3. Verificar que está activa
    if (!category.activo) {
      return SpecificationResult.failure(
        `La categoría "${category.nombre}" ya no está disponible para nuevas publicaciones.`,
        'CATEGORY_INACTIVE',
        {
          categoriaId: category.id,
          categoriaNombre: category.nombre,
          message:
            'Esta categoría ha sido desactivada. Por favor selecciona otra categoría para tu producto.',
        },
      );
    }

    return SpecificationResult.success();
  }
}
