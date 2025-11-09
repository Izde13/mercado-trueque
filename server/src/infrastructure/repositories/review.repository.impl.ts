import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { Review } from '../../domain/entities/review.entity';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(review: Review): Promise<Review> {
    const created = await this.prisma.rese_as.create({
      data: {
        id: review.id,
        intercambio_id: review.intercambioId,
        usuario_calificador_id: review.usuarioCalificadorId,
        usuario_calificado_id: review.usuarioCalificadoId,
        calificacion_usuario: review.calificacionUsuario,
        calificacion_producto: review.calificacionProducto,
        comentario: review.comentario,
        fecha_rese_a: review.fechaResena,
        visible: review.visible,
      },
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.rese_as.findUnique({
      where: { id },
    });

    return review ? this.toDomainEntity(review) : null;
  }

  async findAll(): Promise<Review[]> {
    const reviews = await this.prisma.rese_as.findMany();
    return reviews.map((r) => this.toDomainEntity(r));
  }

  async update(review: Review): Promise<Review> {
    const updated = await this.prisma.rese_as.update({
      where: { id: review.id },
      data: {
        calificacion_usuario: review.calificacionUsuario,
        calificacion_producto: review.calificacionProducto,
        comentario: review.comentario,
        visible: review.visible,
      },
    });

    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rese_as.delete({
      where: { id },
    });
  }

  async findByIntercambioId(intercambioId: string): Promise<Review[]> {
    const reviews = await this.prisma.rese_as.findMany({
      where: { intercambio_id: intercambioId },
    });

    return reviews.map((r) => this.toDomainEntity(r));
  }

  async existsRating(
    intercambioId: string,
    userId: string,
    ratedUserId: string,
  ): Promise<boolean> {
    const review = await this.prisma.rese_as.findFirst({
      where: {
        intercambio_id: intercambioId,
        usuario_calificador_id: userId,
        usuario_calificado_id: ratedUserId,
      },
    });

    return !!review;
  }

  private toDomainEntity(prismaReview: any): Review {
    return new Review(
      prismaReview.id,
      prismaReview.intercambio_id,
      prismaReview.usuario_calificador_id,
      prismaReview.usuario_calificado_id,
      prismaReview.calificacion_usuario,
      prismaReview.calificacion_producto,
      prismaReview.comentario,
      prismaReview.fecha_rese_a,
      prismaReview.visible,
    );
  }
}
