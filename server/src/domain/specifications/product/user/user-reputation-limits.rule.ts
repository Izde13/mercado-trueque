import { Injectable, Inject } from '@nestjs/common';
import { CompositeSpecification } from '../../base/composite-specification';
import { SpecificationResult } from '../../base/specification-result';
import { ProductPublicationContext } from '../product-publication-context';
import { PrismaService } from '../../../../infrastructure/services/prisma.service';

/**
 * Validación #1: Límites de Publicación según Reputación del Usuario
 *
 * Reglas de negocio:
 * - Usuarios nuevos (0 intercambios): máximo 3 productos activos
 * - Usuarios con 1-5 intercambios: máximo 10 productos activos
 * - Usuarios con 5+ intercambios: máximo 30 productos activos
 * - Usuarios con baja calificación (<3.0): máximo 5 productos activos
 *
 * Valor de negocio:
 * - Previene spam de nuevos usuarios
 * - Incentiva completar intercambios para ganar reputación
 * - Protege calidad del marketplace
 */
@Injectable()
export class UserReputationLimitsRule extends CompositeSpecification<ProductPublicationContext> {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async isSatisfiedBy(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult> {
    const { user } = context;

    // 1. Determinar límite según reputación
    const maxProducts = this.calculateMaxProducts(user);

    // 2. Contar productos activos del usuario
    const activeProductsCount = await this.prisma.productos.count({
      where: {
        usuario_id: user.id,
        estado_publicacion: 'disponible',
      },
    });

    // 3. Verificar límite
    if (activeProductsCount >= maxProducts) {
      const reason = this.getReasonMessage(user, maxProducts);

      return SpecificationResult.failure(
        `Has alcanzado el límite de ${maxProducts} productos activos. ${reason}`,
        'USER_PRODUCT_LIMIT_EXCEEDED',
        {
          currentCount: activeProductsCount,
          maxAllowed: maxProducts,
          userReputation: {
            totalIntercambios: user.totalIntercambios,
            calificacionPromedio: user.calificacionPromedio,
          },
        },
      );
    }

    // 4. Advertencia si está cerca del límite (90%)
    if (activeProductsCount >= maxProducts * 0.9) {
      return SpecificationResult.warning(
        `Tienes ${activeProductsCount} de ${maxProducts} productos publicados.`,
        'USER_PRODUCT_LIMIT_WARNING',
        {
          currentCount: activeProductsCount,
          maxAllowed: maxProducts,
          remaining: maxProducts - activeProductsCount,
        },
      );
    }

    return SpecificationResult.success();
  }

  /**
   * Calcula el máximo de productos permitidos según la reputación
   */
  private calculateMaxProducts(user: {
    totalIntercambios: number;
    calificacionPromedio: number;
  }): number {
    // Usuarios con baja calificación: límite reducido
    if (user.calificacionPromedio > 0 && user.calificacionPromedio < 3.0) {
      return 5;
    }

    // Usuarios por cantidad de intercambios completados
    if (user.totalIntercambios === 0) {
      return 3; // Nuevos usuarios
    } else if (user.totalIntercambios <= 5) {
      return 10; // Usuarios intermedios
    } else {
      return 30; // Usuarios experimentados
    }
  }

  /**
   * Genera mensaje personalizado según el motivo del límite
   */
  private getReasonMessage(
    user: {
      totalIntercambios: number;
      calificacionPromedio: number;
    },
    maxProducts: number,
  ): string {
    if (user.calificacionPromedio > 0 && user.calificacionPromedio < 3.0) {
      return 'Mejora tu calificación completando intercambios exitosos para aumentar tu límite.';
    }

    if (user.totalIntercambios === 0) {
      return 'Completa tu primer intercambio para aumentar tu límite a 10 productos.';
    } else if (user.totalIntercambios <= 5) {
      return 'Completa más intercambios (6+) para aumentar tu límite a 30 productos.';
    }

    return 'Has alcanzado el límite máximo de productos activos.';
  }
}
