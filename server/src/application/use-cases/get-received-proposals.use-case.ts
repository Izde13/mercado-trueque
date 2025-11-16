import { Injectable, Inject } from '@nestjs/common';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import { TradeProposalResponseDto } from '../dtos/create-trade-proposal.dto';

/**
 * Obtiene las propuestas recibidas por un usuario con datos enriquecidos
 * Una propuesta es "recibida" cuando alguien solicita un producto que pertenece al usuario
 */
@Injectable()
export class GetReceivedProposalsUseCase {
  constructor(
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
  ) {}

  async execute(usuarioId: string, estado?: string): Promise<any[]> {
    // Obtener todos los productos del usuario
    const userProducts =
      await this.productRepository.findByUsuarioId(usuarioId);
    const userProductIds = userProducts.map((p) => p.id);

    // Obtener todas las propuestas
    const allProposals = await this.tradeProposalRepository.findAll();

    // Filtrar propuestas que solicitan los productos del usuario
    let receivedProposals = allProposals.filter((proposal) =>
      userProductIds.includes(proposal.productoSolicitadoId),
    );

    // Filtrar por estado si se proporciona
    if (estado) {
      receivedProposals = receivedProposals.filter((p) => p.estado === estado);
    }

    // Enriquecer propuestas con datos del usuario oferente y productos
    const enrichedProposals = await Promise.all(
      receivedProposals.map(async (proposal) => {
        const offeringUser = await this.userRepository.findById(
          proposal.usuarioOferenteId,
        );
        const requestedProduct = await this.productRepository.findById(
          proposal.productoSolicitadoId,
        );

        // Obtener los productos ofrecidos en la propuesta
        const productosProuesta =
          await this.productoPropuestaRepository.findByPropuestaId(proposal.id);

        let productosOfrecidos: any[] = [];
        let totalValorOfrecido = 0;

        if (productosProuesta && productosProuesta.length > 0) {
          productosOfrecidos = await Promise.all(
            productosProuesta.map(async (pp) => {
              const producto = await this.productRepository.findById(
                pp.productoId,
              );
              return {
                id: producto?.id,
                title: producto?.titulo || 'Producto Desconocido',
                estimatedValue: producto?.valorEstimado || 0,
                description: producto?.descripcion,
              };
            }),
          );
          totalValorOfrecido = productosOfrecidos.reduce(
            (sum, p) => sum + (p.estimatedValue || 0),
            0,
          );
        }

        return {
          id: proposal.id,
          usuario_oferente_id: proposal.usuarioOferenteId,
          usuarioOferenteNombre: offeringUser?.nombre || 'Usuario Desconocido',
          usuarioOferenteRating: offeringUser?.calificacionPromedio || 0,
          producto_solicitado_id: proposal.productoSolicitadoId,
          productoSolicitado: {
            id: requestedProduct?.id,
            title: requestedProduct?.titulo || 'Producto Desconocido',
            estimatedValue: requestedProduct?.valorEstimado || 0,
            description: requestedProduct?.descripcion,
          },
          estado: proposal.estado || 'pendiente',
          mensaje: proposal.mensaje || '',
          fecha_propuesta: proposal.fechaPropuesta || new Date(),
          fecha_respuesta: proposal.fechaRespuesta,
          productosOfrecidos,
          totalValorOfrecido,
          totalValorSolicitado: requestedProduct?.valorEstimado || 0,
        };
      }),
    );

    return enrichedProposals;
  }
}
