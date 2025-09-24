import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id);

    // Incrementar vistas cuando se consulta un producto específico
    if (product) {
      product.incrementVistas();
      await this.productRepository.update(product);
    }

    return product;
  }
}
