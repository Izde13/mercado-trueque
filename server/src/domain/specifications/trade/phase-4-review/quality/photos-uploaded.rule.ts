import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { ReviewContext } from '../review-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 4.3: Fotos de revisión obligatorias
 */
@Injectable()
export class PhotosUploadedRule implements ISpecification<ReviewContext> {
  async isSatisfiedBy(context: ReviewContext): Promise<SpecificationResult> {
    if (!context.photos || context.photos.length === 0) {
      return SpecificationResult.failure(
        'Debes adjuntar al menos una foto del producto en su estado actual',
        'NO_PHOTOS_PROVIDED',
      );
    }

    if (context.photos.length > 10) {
      return SpecificationResult.failure(
        'Máximo 10 fotos por revisión',
        'TOO_MANY_PHOTOS',
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
