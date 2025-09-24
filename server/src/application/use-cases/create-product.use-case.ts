import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    usuarioId: string,
    categoriaId: string,
    titulo: string,
    descripcion?: string,
    valorEstimado?: number,
    imagenPrincipal?: string,
  ): Promise<Product> {
    const product = Product.create(
      usuarioId,
      categoriaId,
      titulo,
      descripcion,
      valorEstimado,
      imagenPrincipal,
    );

    return this.productRepository.save(product);
  }
}
