import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.1: El producto solicitado debe estar activo
 *
 * Regla de negocio: Solo se pueden hacer propuestas para productos activos y publicados
 * Un producto activo tiene:
 * - estado = 'disponible'
 * - una categoría válida y activa
 * - un estado_producto_id válido
 */
@Injectable()
export class ProductActiveRule implements ISpecification<ProposalContext> {
  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    // Validar que todos los productos solicitados están activos
    for (const product of context.requestedProducts) {
      if (product.status !== 'disponible') {
        return SpecificationResult.failure(
          `El producto "${product.titulo}" ya no está disponible (estado: ${product.status})`,
          'REQUESTED_PRODUCT_NOT_AVAILABLE',
        );
      }

      // Validar que tenga una categoría válida
      if (!product.categoryId || !product.categoryActive) {
        return SpecificationResult.failure(
          `La categoría del producto "${product.titulo}" no está disponible`,
          'INVALID_PRODUCT_CATEGORY',
        );
      }

      // Validar que tenga un estado de producto válido
      if (!product.estadoProductoId) {
        return SpecificationResult.failure(
          `El producto "${product.titulo}" tiene un estado inválido`,
          'INVALID_PRODUCT_STATE',
        );
      }
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ProposalContext>): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ProposalContext> {
    throw new Error('No implementado');
  }
}
