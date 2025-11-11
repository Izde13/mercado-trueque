import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { DeliveryContext } from '../delivery-context';
import { ISpecification } from '../../../base/specification.interface';
import type { ProductReviewRepository } from '../../../../repositories/product-review.repository';

/**
 * VALIDACIÓN 5.1: Ambas revisiones deben estar aprobadas
 *
 * ARQUITECTURA:
 * - Depende de interfaz ProductReviewRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class ReviewApprovedRule implements ISpecification<DeliveryContext> {
  constructor(
    @Inject('ProductReviewRepository')
    private readonly productReviewRepository: ProductReviewRepository,
  ) {}

  async isSatisfiedBy(context: DeliveryContext): Promise<SpecificationResult> {
    const allApproved =
      await this.productReviewRepository.allApprovedForIntercambio(
        context.intercambioId,
      );

    if (!allApproved) {
      return SpecificationResult.failure(
        'No todas las revisiones han sido aprobadas aún',
        'REVIEWS_NOT_APPROVED',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<DeliveryContext>): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<DeliveryContext>): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<DeliveryContext> {
    throw new Error('No implementado');
  }
}
