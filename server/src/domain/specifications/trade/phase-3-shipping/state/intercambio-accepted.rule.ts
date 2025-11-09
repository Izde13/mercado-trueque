import { Injectable, Inject } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ShippingContext } from '../shipping-context';
import { ISpecification } from '../../../base/specification.interface';
import type { IntercambioRepository } from '../../../../repositories/intercambio.repository';

/**
 * VALIDACIÓN 3.1: El intercambio debe estar en estado ACEPTADA
 *
 * ARQUITECTURA:
 * - Depende de interfaz IntercambioRepository (no de PrismaService)
 * - La implementación se inyecta en tiempo de ejecución desde la capa de infraestructura
 */
@Injectable()
export class IntercambioAcceptedRule
  implements ISpecification<ShippingContext>
{
  constructor(
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
  ) {}

  async isSatisfiedBy(context: ShippingContext): Promise<SpecificationResult> {
    const status = await this.intercambioRepository.getStatus(
      context.intercambioId,
    );

    if (!status) {
      return SpecificationResult.failure(
        'Intercambio no encontrado',
        'INTERCAMBIO_NOT_FOUND',
      );
    }

    // Validar que el intercambio esté en estado iniciado (listo para enviar)
    if (status !== 'iniciado') {
      return SpecificationResult.failure(
        `El intercambio no está en estado correcto para envío (estado: ${status})`,
        'INVALID_INTERCAMBIO_STATE',
      );
    }

    return SpecificationResult.success();
  }

  and(other: ISpecification<ShippingContext>): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }

  or(other: ISpecification<ShippingContext>): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }

  not(): ISpecification<ShippingContext> {
    throw new Error('No implementado');
  }
}
