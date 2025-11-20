import { Injectable, Inject } from '@nestjs/common';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';

/**
 * Obtiene todos los intercambios del usuario con datos enriquecidos
 */
@Injectable()
export class GetUserTradesUseCase {
  constructor(
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
  ) {}

  async execute(usuarioId: string): Promise<any[]> {
    // Obtener todos los intercambios
    const allIntercambios = await this.intercambioRepository.findAll();

    // Caso especial: pendientes de revisión (para revisores)
    if (usuarioId === 'pending-review') {
      const pendingReviews: any[] = [];

      for (const intercambio of allIntercambios) {
        if (intercambio.estado !== 'productos_enviados') continue;

        const propuesta =
          await this.tradeProposalRepository.findByIdWithRelations(
            intercambio.propuestaId,
          );
        if (!propuesta) continue;

        // Obtener usuarios
        const usuarioOferta = await this.userRepository.findById(
          propuesta.usuarioOferenteId,
        );

        let usuarioRecepcion: any = null;
        const productoSolicitado = propuesta.productoSolicitadoId
          ? await this.productRepository.findById(
              propuesta.productoSolicitadoId,
            )
          : null;
        if (productoSolicitado) {
          usuarioRecepcion = await this.userRepository.findById(
            productoSolicitado.usuarioId,
          );
        }

        // Obtener productos ofrecidos
        const productosPropuesta =
          await this.productoPropuestaRepository.findByPropuestaId(
            propuesta.id,
          );

        const productosOfrecidos: any[] = [];
        if (productosPropuesta && productosPropuesta.length > 0) {
          for (const pp of productosPropuesta) {
            const prod = await this.productRepository.findById(pp.productoId);
            if (prod) {
              productosOfrecidos.push({
                id: prod.id,
                nombre: prod.titulo,
                descripcion: prod.descripcion,
                categoriaId: prod.categoriaId,
                usuarioId: prod.usuarioId,
              });
            }
          }
        }

        // Obtener producto solicitado
        const productoRecibido = productoSolicitado
          ? {
              id: productoSolicitado.id,
              nombre: productoSolicitado.titulo,
              descripcion: productoSolicitado.descripcion,
              categoriaId: productoSolicitado.categoriaId,
              usuarioId: productoSolicitado.usuarioId,
            }
          : null;

        pendingReviews.push({
          id: intercambio.id,
          propuesta_id: intercambio.propuestaId,
          estado: intercambio.estado,
          fecha_creacion: intercambio.fechaInicio,
          fecha_completado: intercambio.fechaCompletado,
          centro_distribucion_id: intercambio.centroDistribucionId,
          usuarioOferta: {
            id: usuarioOferta?.id,
            nombre: usuarioOferta?.nombre,
            apellido: usuarioOferta?.apellido,
            email: usuarioOferta?.email,
          },
          usuarioRecepcion: usuarioRecepcion
            ? {
                id: usuarioRecepcion.id,
                nombre: usuarioRecepcion.nombre,
                apellido: usuarioRecepcion.apellido,
                email: usuarioRecepcion.email,
              }
            : null,
          productosOfrecidos,
          productosRecibidos: productoRecibido ? [productoRecibido] : [],
        });
      }

      return pendingReviews;
    }

    // Filtrar intercambios donde el usuario está involucrado
    const userIntercambios: any[] = [];

    for (const intercambio of allIntercambios) {
      // Obtener la propuesta asociada
      const propuesta =
        await this.tradeProposalRepository.findByIdWithRelations(
          intercambio.propuestaId,
        );

      if (!propuesta) continue;

      // Verificar si el usuario es parte de este intercambio
      const isOfferingUser = propuesta.usuarioOferenteId === usuarioId;
      const isRequestingUser = propuesta.productoSolicitadoId
        ? (
            await this.productRepository.findById(
              propuesta.productoSolicitadoId,
            )
          )?.usuarioId === usuarioId
        : false;

      if (!isOfferingUser && !isRequestingUser) continue;

      // Enriquecer datos del intercambio
      const otroUsuarioId = isOfferingUser
        ? (
            await this.productRepository.findById(
              propuesta.productoSolicitadoId,
            )
          )?.usuarioId
        : propuesta.usuarioOferenteId;

      const otroUsuario = otroUsuarioId
        ? await this.userRepository.findById(otroUsuarioId)
        : null;

      // Obtener productos ofrecidos
      const productosPropuesta =
        await this.productoPropuestaRepository.findByPropuestaId(propuesta.id);

      let productosOfrecidos: any[] = [];
      let totalValorOfrecido = 0;

      if (productosPropuesta && productosPropuesta.length > 0) {
        productosOfrecidos = await Promise.all(
          productosPropuesta.map(async (pp) => {
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

      // Obtener producto solicitado
      const productSolicitado = await this.productRepository.findById(
        propuesta.productoSolicitadoId,
      );

      userIntercambios.push({
        id: intercambio.id,
        propuesta_id: intercambio.propuestaId,
        estado: intercambio.estado || 'iniciado',
        fecha_inicio: intercambio.fechaInicio,
        fecha_completado: intercambio.fechaCompletado,
        centro_distribucion_id: intercambio.centroDistribucionId,
        usuario_oferente_id: propuesta.usuarioOferenteId,
        usuario_oferente_nombre: isOfferingUser
          ? (await this.userRepository.findById(propuesta.usuarioOferenteId))
              ?.nombre || 'Usuario Desconocido'
          : otroUsuario?.nombre || 'Usuario Desconocido',
        usuario_solicitante_id: otroUsuarioId,
        producto_solicitado: {
          id: productSolicitado?.id,
          title: productSolicitado?.titulo || 'Producto Desconocido',
          estimatedValue: productSolicitado?.valorEstimado || 0,
        },
        productos_ofrecidos: productosOfrecidos,
        total_valor_ofrecido: totalValorOfrecido,
        total_valor_solicitado: productSolicitado?.valorEstimado || 0,
        rol_usuario: isOfferingUser ? 'oferente' : 'solicitante',
      });
    }

    return userIntercambios;
  }
}
