import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { RatingContext } from '../rating-context';
import { ISpecification } from '../../../base/specification.interface';
import type { IntercambioRepository } from '../../../../repositories/intercambio.repository';

/**
 * VALIDACIÓN 6.1: El intercambio debe estar completado
 *
 * ARQUITECTURA:
 * - Depende de interfaz IntercambioRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class TradeDeliveredRule implements ISpecification<RatingContext> {
  constructor(
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
  ) {}

  async isSatisfiedBy(context: RatingContext): Promise<SpecificationResult> {
    const status = await this.intercambioRepository.getStatus(
      context.intercambioId,
    );

    if (!status) {
      return SpecificationResult.failure(
        'Intercambio no encontrado',
        'INTERCAMBIO_NOT_FOUND',
      );
    }

    // Solo se puede calificar después de que esté en revisión o completado
    if (status !== 'en_revision' && status !== 'completado') {
      return SpecificationResult.failure(
        `Solo puedes calificar intercambios completados. Estado actual: ${status}`,
        'INVALID_INTERCAMBIO_STATE',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<RatingContext>): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<RatingContext>): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<RatingContext> {
    throw new Error('No implementado');
  }
}
