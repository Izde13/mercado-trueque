import { Review } from '../entities/review.entity';

export interface ReviewRepository {
  save(review: Review): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findAll(): Promise<Review[]>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
  findByUsuarioCalificadoId(usuarioId: string): Promise<Review[]>;
  findByUsuarioCalificadorId(usuarioId: string): Promise<Review[]>;
  findByIntercambioId(intercambioId: string): Promise<Review[]>;
  findVisible(): Promise<Review[]>;
}
