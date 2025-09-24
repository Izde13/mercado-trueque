import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async executeByCategory(categoriaId: string): Promise<Product[]> {
    return this.productRepository.findByCategoriaId(categoriaId);
  }

  async executeByUser(usuarioId: string): Promise<Product[]> {
    return this.productRepository.findByUsuarioId(usuarioId);
  }

  async executeByStatus(estado: string): Promise<Product[]> {
    return this.productRepository.findByEstadoPublicacion(estado);
  }
}
