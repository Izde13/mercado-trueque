import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ReviewContext } from '../review-context';
import { ISpecification } from '../../../base/specification.interface';
import type { ShipmentRepository } from '../../../../repositories/shipment.repository';

/**
 * VALIDACIÓN 4.1: Los productos deben haber llegado al centro
 *
 * ARQUITECTURA:
 * - Depende de interfaz ShipmentRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class ProductsReceivedAtCenterRule
  implements ISpecification<ReviewContext>
{
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
  ) {}

  async isSatisfiedBy(context: ReviewContext): Promise<SpecificationResult> {
    const hasReceivedAtCenter =
      await this.shipmentRepository.hasReceivedAtCenter(
        context.intercambioId,
        context.productoId,
      );

    if (!hasReceivedAtCenter) {
      return SpecificationResult.failure(
        'El producto aún no ha llegado al centro de distribución',
        'PRODUCT_NOT_AT_CENTER',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<ReviewContext>): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ReviewContext>): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ReviewContext> {
    throw new Error('No implementado');
  }
}
