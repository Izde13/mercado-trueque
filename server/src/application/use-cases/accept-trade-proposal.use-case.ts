import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AcceptancePhaseValidator } from '../../domain/specifications/trade/phase-2-acceptance/acceptance-phase.validator';
import { AcceptanceContext } from '../../domain/specifications/trade/phase-2-acceptance/acceptance-context';
import {
  AcceptTradeProposalDto,
  IntercambioResponseDto,
} from '../dtos/accept-trade-proposal.dto';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import type { ProductoPropuestaRepository } from '../../domain/repositories/producto-propuesta.repository';
import type { CentroDistribucionRepository } from '../../domain/repositories/centro-distribucion.repository';
import { Intercambio } from '../../domain/entities/intercambio.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AcceptTradeProposalUseCase {
  constructor(
    private readonly acceptanceValidator: AcceptancePhaseValidator,
    private readonly notificationService: NotificationService,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductoPropuestaRepository')
    private readonly productoPropuestaRepository: ProductoPropuestaRepository,
    @Inject('CentroDistribucionRepository')
    private readonly centroDistribucionRepository: CentroDistribucionRepository,
  ) {}

  async execute(
    userId: string,
    proposalId: string,
  ): Promise<IntercambioResponseDto> {
    // 1. Obtener propuesta
    const propuesta =
      await this.tradeProposalRepository.findByIdWithRelations(proposalId);

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    // 2. Obtener producto solicitado (debe ser del usuario actual)
    const productSolicitado = await this.productRepository.findById(
      propuesta.productoSolicitadoId,
    );

    if (!productSolicitado) {
      throw new NotFoundException('Producto solicitado no encontrado');
    }

    // 3. Obtener usuario actual
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 4. Obtener usuario oferente
    const oferente = await this.userRepository.findById(
      propuesta.usuarioOferenteId,
    );

    if (!oferente) {
      throw new BadRequestException('Usuario oferente no existe');
    }

    // 5. Cargar productos asociados a la propuesta
    const productosPropuesta =
      await this.productoPropuestaRepository.findByPropuestaId(proposalId);

    // Validar que la propuesta tiene productos
    if (!productosPropuesta || productosPropuesta.length === 0) {
      throw new BadRequestException(
        'La propuesta no tiene productos asociados',
      );
    }

    // Obtener detalles de los productos ofrecidos
    const productosOfrecidos = await Promise.all(
      productosPropuesta.map((pp) =>
        this.productRepository.findById(pp.productoId),
      ),
    );

    // Filtrar productos nulos y validar que todos existan
    const productosOfrecidosValidos = productosOfrecidos.filter(
      (p) => p !== null,
    );

    if (productosOfrecidosValidos.length === 0) {
      throw new BadRequestException('No se encontraron productos ofrecidos');
    }

    // Validar que todos los productos estén activos
    const todosActivos = productosOfrecidosValidos.every(
      (p) =>
        p.estadoPublicacion === 'disponible' ||
        p.estadoPublicacion === 'activo',
    );

    // 5. Obtener centro distribución disponible ANTES de validar
    const centros = await this.centroDistribucionRepository.findActivos();
    const centro = centros[0];

    if (!centro) {
      throw new BadRequestException('No hay centro distribución disponible');
    }

    // 6. Crear contexto para validación (con centro ya asignado)
    const context: AcceptanceContext = {
      userId: userId,
      userStatus: (currentUser.estado as 'activo' | 'inactivo') ?? 'activo',
      userRating: currentUser.calificacionPromedio ?? 0,
      userTotalTrades: currentUser.totalIntercambios ?? 0,
      timestamp: new Date(),
      proposalId: propuesta.id,
      proposal: {
        id: propuesta.id,
        status: propuesta.estado ?? 'pendiente',
        createdAt: propuesta.fechaPropuesta ?? new Date(),
        requestedProductOwnerId: productSolicitado.usuarioId,
        offerentId: propuesta.usuarioOferenteId,
        offeredProductCount: productosOfrecidosValidos.length,
      },
      products: {
        offeredCount: productosOfrecidosValidos.length,
        requestedCount: 1, // El producto solicitado
        allActive:
          todosActivos && productSolicitado.estadoPublicacion === 'disponible',
      },
      intercambio: {
        id: '', // Será generado al crear el intercambio
        centroDistribucionId: centro.id,
      },
    };

    // 7. Validar aceptación
    const validation = await this.acceptanceValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 8. Crear intercambio con estado inicial
    const intercambio = Intercambio.create(propuesta.id, centro.id);

    const savedIntercambio = await this.intercambioRepository.save(intercambio);

    // 9. Actualizar estado de propuesta
    // Primero modifica la propuesta en memoria
    propuesta.accept();
    // Luego persiste los cambios a la BD
    const proposalActualizado =
      await this.tradeProposalRepository.update(propuesta);

    // 10. NOTIFICACIONES: Avisar a ambos usuarios
    try {
      const offerentFullName = `${oferente.nombre} ${oferente.apellido}`.trim();
      const ownerFullName =
        `${currentUser.nombre} ${currentUser.apellido}`.trim();

      // Notificar al oferente que su propuesta fue aceptada
      await this.notificationService.notifyProposalAccepted(
        oferente.id,
        propuesta.id,
        savedIntercambio.id,
        ownerFullName,
      );

      // Notificar al dueño del producto que aceptó la propuesta
      await this.notificationService.notifyProposalAcceptedToOwner(
        currentUser.id,
        savedIntercambio.id,
        offerentFullName,
      );
    } catch (error) {
      // Log error pero no fallar la aceptación
      console.error(
        'Error creating notifications for accepted proposal:',
        error,
      );
    }

    return {
      id: savedIntercambio.id,
      propuesta_id: savedIntercambio.propuestaId,
      estado: 'aceptada',
      fecha_inicio: savedIntercambio.fechaInicio,
      centro_distribucion_id: savedIntercambio.centroDistribucionId,
      fecha_completado: savedIntercambio.fechaCompletado ?? undefined,
    };
  }
}
