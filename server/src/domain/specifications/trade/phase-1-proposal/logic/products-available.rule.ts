import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ProposalContext } from '../proposal-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 1.6: Los productos ofrecidos deben ser válidos y disponibles
 */
@Injectable()
export class ProductsAvailableRule implements ISpecification<ProposalContext> {
  async isSatisfiedBy(context: ProposalContext): Promise<SpecificationResult> {
    // Validar cantidad de productos ofrecidos
    if (context.offeredProducts.length === 0) {
      return SpecificationResult.failure(
        'Debes ofrecer al menos un producto',
        'NO_OFFERED_PRODUCTS',
      );
    }

    if (context.offeredProducts.length > 5) {
      return SpecificationResult.failure(
        'Máximo 5 productos por propuesta',
        'TOO_MANY_PRODUCTS',
      );
    }

    // Validar que cada producto ofrecido está disponible
    for (const product of context.offeredProducts) {
      if (product.status !== 'disponible') {
        return SpecificationResult.failure(
          `El producto "${product.titulo}" no está disponible (estado: ${product.status})`,
          'PRODUCT_NOT_AVAILABLE',
        );
      }
    }

    // Validar que el producto solicitado está disponible
    for (const product of context.requestedProducts) {
      if (product.status !== 'disponible') {
        return SpecificationResult.failure(
          `El producto solicitado "${product.titulo}" no está disponible`,
          'REQUESTED_PRODUCT_NOT_AVAILABLE',
        );
      }
    }

    // Validar que no se ofrece el mismo producto que se solicita
    const offeredIds = context.offeredProducts.map((p) => p.id);
    for (const requested of context.requestedProducts) {
      if (offeredIds.includes(requested.id)) {
        return SpecificationResult.failure(
          'No puedes ofrecer el mismo producto que estás solicitando',
          'DUPLICATE_PRODUCT',
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
