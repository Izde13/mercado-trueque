import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductImage } from '../../domain/entities/product-image';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { ProductPublicationValidator } from '../../domain/specifications/product/product-publication.validator';
import { ProductPublicationContext } from '../../domain/specifications/product/product-publication-context';
import { ProductValidationException } from '../../domain/errors';

interface ImageData {
  url: string;
  orden?: number;
  esPrincipal?: boolean;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly publicationValidator: ProductPublicationValidator,
  ) {}

  async execute(
    usuarioId: string,
    categoriaId: string,
    estadoProductoId: string,
    titulo: string,
    imagenes: ImageData[],
    descripcion?: string,
    valorEstimado?: number,
  ): Promise<Product> {
    // 1. Obtener datos del usuario para validaciones
    const user = await this.userRepository.findById(usuarioId);
    if (!user) {
      throw new ProductValidationException(
        'Usuario no encontrado',
        'USER_NOT_FOUND',
        { usuarioId },
      );
    }

    // 2. Crear contexto de validación
    const context: ProductPublicationContext = {
      product: {
        titulo,
        descripcion: descripcion || '',
        categoriaId,
        estadoProductoId,
        valorEstimado: valorEstimado || 0,
        imagenes: imagenes.map((img, index) => ({
          url: img.url,
          orden: img.orden || index + 1,
          esPrincipal: img.esPrincipal || index === 0,
        })),
      },
      user: {
        id: user.id,
        email: user.email,
        estado: user.estado?.toString() || 'activo',
        calificacionPromedio: user.calificacionPromedio || 0,
        totalIntercambios: user.totalIntercambios || 0,
        fechaRegistro: user.fechaRegistro || new Date(),
      },
      metadata: {
        timestamp: new Date(),
      },
    };

    // 3. Ejecutar validaciones de negocio
    const validationResult = await this.publicationValidator.validate(context);

    // Si hay un error, lanzar excepción
    if (!validationResult.isValid && validationResult.severity === 'error') {
      throw ProductValidationException.fromSpecificationResult(
        validationResult,
      );
    }

    // Si hay un warning, podemos loggearlo o retornarlo en metadata
    // (por ahora solo lo dejamos pasar, pero en producción podrías loggearlo)
    if (validationResult.severity === 'warning') {
      // TODO: Loggear warning o incluir en respuesta
      console.warn('[Product Publication Warning]', validationResult.message);
    }

    // 4. Convertir imagenes a entidades ProductImage
    const productImages: ProductImage[] = imagenes.map((img, index) => {
      return ProductImage.create(
        '', // El productoId se asignará después
        img.url,
        img.orden || index + 1,
        img.esPrincipal || index === 0, // Primera imagen es principal por defecto
      );
    });

    // 5. Crear producto
    const product = Product.create(
      usuarioId,
      categoriaId,
      estadoProductoId,
      titulo,
      descripcion,
      valorEstimado,
      productImages,
    );

    // 6. Asignar productoId a las imágenes
    productImages.forEach((img) => {
      img.productoId = product.id;
    });

    // 7. Guardar en BD
    return this.productRepository.save(product);
  }
}
