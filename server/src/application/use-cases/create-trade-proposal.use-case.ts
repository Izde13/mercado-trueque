import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ProposalPhaseValidator } from '../../domain/specifications/trade/phase-1-proposal/proposal-phase.validator';
import { ProposalContext } from '../../domain/specifications/trade/phase-1-proposal/proposal-context';
import {
  CreateTradeProposalDto,
  TradeProposalResponseDto,
} from '../dtos/create-trade-proposal.dto';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import { TradeProposal } from '../../domain/entities/trade-proposal.entity';
import { ProductoPropuesta } from '../../domain/entities/producto-propuesta.entity';
import { NotificationService } from '../services/notification.service';
import { ZmqProducerService } from '../../infrastructure/zmq';

@Injectable()
export class CreateTradeProposalUseCase {
  constructor(
    private readonly proposalValidator: ProposalPhaseValidator,
    private readonly notificationService: NotificationService,
    private readonly zmqProducerService: ZmqProducerService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
  ) {}

  async execute(
    input: CreateTradeProposalDto,
  ): Promise<TradeProposalResponseDto> {
    // 1. Obtener datos del usuario oferente
    const oferente = await this.userRepository.findById(
      input.usuario_oferente_id,
    );

    if (!oferente) {
      throw new BadRequestException('Usuario oferente no existe');
    }

    // 2. Obtener producto solicitado (con usuario dueño)
    const productSolicitado = await this.productRepository.findById(
      input.requested_product_id,
    );

    if (!productSolicitado) {
      throw new BadRequestException('Producto solicitado no existe');
    }

    // 3. Obtener productos ofrecidos
    const offeredProducts: any[] = [];
    for (const productId of input.offered_product_ids) {
      const product = await this.productRepository.findById(productId);
      if (product) {
        offeredProducts.push(product);
      }
    }

    if (offeredProducts.length !== input.offered_product_ids.length) {
      throw new BadRequestException('Uno o más productos ofrecidos no existen');
    }

    // 4. Crear contexto para validación
    const context: ProposalContext = {
      userId: input.usuario_oferente_id,
      userStatus: (oferente.estado as 'activo' | 'inactivo') ?? 'activo',
      userRating: oferente.calificacionPromedio ?? 0,
      userTotalTrades: oferente.totalIntercambios ?? 0,
      timestamp: new Date(),
      offerent: {
        id: oferente.id,
        email: oferente.email,
        nombre: oferente.nombre,
        apellido: oferente.apellido,
        estado: (oferente.estado as 'activo' | 'inactivo') ?? 'activo',
        calificacionPromedio: oferente.calificacionPromedio ?? 0,
        totalIntercambios: oferente.totalIntercambios ?? 0,
        fechaRegistro: oferente.fechaRegistro ?? new Date(),
      },
      offeredProducts: offeredProducts.map((p) => ({
        id: p.id,
        ownerId: p.usuarioId,
        titulo: p.titulo,
        descripcion: p.descripcion ?? '',
        estimatedValue: p.valorEstimado ?? 0,
        status: (p.estadoPublicacion ?? 'disponible') as any,
        estadoProductoId: p.estadoProductoId,
        categoryId: p.categoriaId,
        categoryName: p.titulo,
        categoryActive: true,
        createdAt: p.fechaPublicacion ?? new Date(),
      })),
      requestedProducts: [
        {
          id: productSolicitado.id,
          ownerId: productSolicitado.usuarioId,
          titulo: productSolicitado.titulo,
          descripcion: productSolicitado.descripcion ?? '',
          estimatedValue: productSolicitado.valorEstimado ?? 0,
          status: (productSolicitado.estadoPublicacion ?? 'disponible') as any,
          estadoProductoId: productSolicitado.estadoProductoId,
          categoryId: productSolicitado.categoriaId,
          categoryName: productSolicitado.titulo,
          categoryActive: true,
          createdAt: productSolicitado.fechaPublicacion ?? new Date(),
        },
      ],
      message: input.message || '',
      totalOfferedValue: offeredProducts.reduce(
        (sum, p) => sum + (p.valorEstimado ?? 0),
        0,
      ),
      totalRequestedValue: productSolicitado.valorEstimado ?? 0,
      valueBalance: 0,
    };

    // 5. Calcular balance de valor
    context.valueBalance =
      (context.totalRequestedValue ?? 0) - (context.totalOfferedValue ?? 0);

    // 6. Validar propuesta
    const validation = await this.proposalValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 7. Crear propuesta en BD
    const propuesta = TradeProposal.create(
      input.requested_product_id,
      input.usuario_oferente_id,
      input.message,
    );

    const savedProposal = await this.tradeProposalRepository.save(propuesta);

    // 8. Guardar productos ofrecidos asociados a la propuesta
    const productosAsociados: ProductoPropuesta[] = [];
    for (let i = 0; i < input.offered_product_ids.length; i++) {
      const productoPropuesta = ProductoPropuesta.create(
        savedProposal.id,
        input.offered_product_ids[i],
        i + 1, // orden empieza en 1
      );
      const savedProductoPropuesta =
        await this.productoPropuestaRepository.save(productoPropuesta);
      productosAsociados.push(savedProductoPropuesta);
    }

    // 9. NOTIFICACIÓN: Avisar al dueño del producto solicitado
    try {
      const offerentFullName = `${oferente.nombre} ${oferente.apellido}`.trim();
      await this.notificationService.notifyProposalCreated(
        productSolicitado.usuarioId,
        savedProposal.id,
        offerentFullName,
        productSolicitado.titulo,
      );
    } catch (error) {
      // Log error pero no fallar la creación de la propuesta
      console.error('Error creating notification for proposal:', error);
    }

    // 10. EVENTO ZMQ: Publicar evento a subscribers (para envío de correos, etc.)
    try {
      const ownerUser = await this.userRepository.findById(productSolicitado.usuarioId);
      const ownerEmail = ownerUser?.email || 'unknown@example.com';
      const ownerName = `${ownerUser?.nombre || ''} ${ownerUser?.apellido || ''}`.trim();

      const oferenteName = `${oferente.nombre || ''} ${oferente.apellido || ''}`.trim();

      // Construir JSON con información de la propuesta
      const eventData = JSON.stringify({
        ownerEmail: ownerEmail,
        ownerName: ownerName,
        oferentEmail: oferente.email,
        oferentName: oferenteName,
        proposalId: savedProposal.id,
        proposalMessage: savedProposal.mensaje || '',
        requestedProductTitle: productSolicitado.titulo,
        requestedProductId: productSolicitado.id,
        timestamp: new Date().toISOString(),
      });

      await this.zmqProducerService.publishEvent('SendEmail', eventData);
      console.log(`✅ Evento ZMQ publicado: ProposalCreated para ${ownerEmail}`);
    } catch (error) {
      // Log error pero no fallar la creación de la propuesta
      console.error('Error publishing ZMQ event for proposal:', error);
    }

    return {
      id: savedProposal.id,
      usuario_oferente_id: savedProposal.usuarioOferenteId,
      producto_solicitado_id: savedProposal.productoSolicitadoId,
      estado: savedProposal.estado || 'pendiente',
      mensaje: savedProposal.mensaje || '',
      fecha_propuesta: savedProposal.fechaPropuesta || new Date(),
      fecha_respuesta: savedProposal.fechaRespuesta || undefined,
    };
  }
}
