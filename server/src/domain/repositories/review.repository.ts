import { Review } from '../entities/review.entity';

export interface ReviewRepository {
  save(review: Review): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findAll(): Promise<Review[]>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
  findByIntercambioId(intercambioId: string): Promise<Review[]>;
  existsRating(
    intercambioId: string,
    userId: string,
    ratedUserId: string,
  ): Promise<boolean>;
}
