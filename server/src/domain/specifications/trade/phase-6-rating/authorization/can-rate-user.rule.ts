import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { RatingContext } from '../rating-context';
import { ISpecification } from '../../../base/specification.interface';
import type { IntercambioRepository } from '../../../../repositories/intercambio.repository';

/**
 * VALIDACIÓN 6.2: El usuario puede calificar
 *
 * ARQUITECTURA:
 * - Depende de interfaz IntercambioRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 * - La participación debe ser validada en el contexto (RatingContext) con objetos de dominio
 */
@Injectable()
export class CanRateUserRule implements ISpecification<RatingContext> {
  constructor(
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
  ) {}

  async isSatisfiedBy(context: RatingContext): Promise<SpecificationResult> {
    // Verificar que el usuario no sea el mismo
    if (context.userId === context.ratedUserId) {
      return SpecificationResult.failure(
        'No puedes calificarte a ti mismo',
        'CANNOT_RATE_YOURSELF',
      );
    }

    // Verificar que existe el intercambio
    const intercambio = await this.intercambioRepository.findById(
      context.intercambioId,
    );

    if (!intercambio) {
      return SpecificationResult.failure(
        'Intercambio no encontrado',
        'INTERCAMBIO_NOT_FOUND',
      );
    }

    // Nota: La validación de participación debe hacerse en el contexto
    // pasando información completa del intercambio y sus participantes
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
