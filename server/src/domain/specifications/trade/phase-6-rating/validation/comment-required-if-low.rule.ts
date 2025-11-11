import { Injectable } from '@nestjs/common';
import { SpecificationResult } from '../../../base/specification-result';
import { RatingContext } from '../rating-context';
import { ISpecification } from '../../../base/specification.interface';

/**
 * VALIDACIÓN 6.4: Comentario obligatorio para calificaciones bajas
 */
@Injectable()
export class CommentRequiredIfLowRule implements ISpecification<RatingContext> {
  async isSatisfiedBy(context: RatingContext): Promise<SpecificationResult> {
    // Si calificación del usuario es < 3, comentario obligatorio
    if (context.userRating < 3) {
      if (!context.comment || context.comment.trim().length === 0) {
        return SpecificationResult.failure(
          'Debes incluir un comentario para calificaciones bajas',
          'COMMENT_REQUIRED',
        );
      }

      if (context.comment.length < 20) {
        return SpecificationResult.failure(
          'El comentario debe tener al menos 20 caracteres',
          'COMMENT_TOO_SHORT',
        );
      }
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
