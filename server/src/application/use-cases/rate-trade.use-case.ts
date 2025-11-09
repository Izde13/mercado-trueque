import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { RatingPhaseValidator } from '../../domain/specifications/trade/phase-6-rating/rating-phase.validator';
import { RatingContext } from '../../domain/specifications/trade/phase-6-rating/rating-context';
import { RateTradeDto, RatingResponseDto } from '../dtos/rate-trade.dto';
import type { IntercambioRepository } from '../../domain/repositories/intercambio.repository';
import type { TradeProposalRepository } from '../../domain/repositories/trade-proposal.repository';
import type { ReviewRepository } from '../../domain/repositories/review.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { Review } from '../../domain/entities/review.entity';
import { EstadoIntercambio } from '../../domain/entities/intercambio.entity';
import { Usuario } from '../../domain/entities/user.entity';

@Injectable()
export class RateTradeUseCase {
  constructor(
    private readonly ratingValidator: RatingPhaseValidator,
    @Inject('IntercambioRepository')
    private readonly intercambioRepository: IntercambioRepository,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: TradeProposalRepository,
    @Inject('ReviewRepository')
    private readonly reviewRepository: ReviewRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RateTradeDto): Promise<RatingResponseDto> {
    // 1. Obtener intercambio
    const intercambio = await this.intercambioRepository.findById(
      input.intercambio_id,
    );

    if (!intercambio) {
      throw new NotFoundException('Intercambio no encontrado');
    }

    // 2. Obtener propuesta
    const propuesta = await this.tradeProposalRepository.findByIdWithRelations(
      intercambio.propuestaId,
    );

    if (!propuesta) {
      throw new NotFoundException('Propuesta no encontrada');
    }

    // 3. Validar que el usuario_id sea uno de los usuarios del intercambio
    const esOferente = input.usuario_id === propuesta.usuarioOferenteId;
    const esReceptor = input.usuario_id !== propuesta.usuarioOferenteId; // El otro usuario

    if (!esOferente && !esReceptor) {
      throw new BadRequestException(
        'El usuario no está involucrado en este intercambio',
      );
    }

    // 4. Validar que no haya calificado antes
    const yaCalfico = await this.reviewRepository.existsRating(
      input.intercambio_id,
      input.usuario_id,
      input.usuario_calificado_id,
    );

    if (yaCalfico) {
      throw new BadRequestException('Ya has calificado este intercambio');
    }

    // 5. Crear contexto para validación
    const context: RatingContext = {
      userId: input.usuario_id,
      userStatus: 'activo',
      userRating: input.calificacion_usuario,
      userTotalTrades: 0,
      timestamp: new Date(),
      intercambioId: input.intercambio_id,
      ratedUserId: input.usuario_calificado_id,
      productRating: input.calificacion_producto,
      communicationRating: undefined,
      comment: input.comentario,
      images: undefined,
    };

    // 6. Validar calificación
    const validation = await this.ratingValidator.validate(context);

    if (!validation.isValid && validation.severity === 'error') {
      throw new BadRequestException({
        message: validation.message,
        code: validation.code,
      });
    }

    // 7. Crear calificación
    const review = Review.create(
      input.intercambio_id,
      input.usuario_id,
      input.usuario_calificado_id,
      input.calificacion_usuario,
      input.calificacion_producto,
      input.comentario,
    );

    const savedReview = await this.reviewRepository.save(review);

    // 8. Verificar si ambos usuarios han calificado
    const reviews = await this.reviewRepository.findByIntercambioId(
      input.intercambio_id,
    );

    if (reviews.length >= 2) {
      // Ambos han calificado, actualizar reputación de ambos usuarios

      // Actualizar reputación del usuario que fue calificado
      const usuario = await this.userRepository.findById(
        input.usuario_calificado_id,
      );
      if (usuario) {
        // Calcular promedio de calificaciones recibidas
        const calificacionesRecibidas = reviews.filter(
          (r) => r.usuarioCalificadoId === input.usuario_calificado_id,
        );
        const promedioPuntos =
          calificacionesRecibidas.reduce(
            (sum, r) => sum + r.calificacionUsuario,
            0,
          ) / calificacionesRecibidas.length;

        const usuarioActualizado = new Usuario(
          usuario.id,
          usuario.email,
          usuario.nombre,
          usuario.apellido,
          usuario.contrasena,
          usuario.rolId,
          usuario.telefono,
          usuario.fechaRegistro,
          usuario.estado,
          usuario.avatarUrl,
          parseFloat(promedioPuntos.toFixed(2)),
          usuario.totalIntercambios,
        );
        await this.userRepository.update(usuarioActualizado);
      }

      // Actualizar reputación del otro usuario también
      // Si el usuario actual es el OFERENTE, el otro es el usuario_calificado_id
      // Si el usuario actual es el RECEPTOR, el otro es el OFERENTE
      const otroUsuarioId = esOferente
        ? input.usuario_calificado_id
        : propuesta.usuarioOferenteId;

      const otroUsuario = await this.userRepository.findById(otroUsuarioId);
      if (otroUsuario) {
        const calificacionesRecibidas = reviews.filter(
          (r) => r.usuarioCalificadoId === otroUsuarioId,
        );
        const promedioPuntos =
          calificacionesRecibidas.reduce(
            (sum, r) => sum + r.calificacionUsuario,
            0,
          ) / calificacionesRecibidas.length;

        const usuarioActualizado = new Usuario(
          otroUsuario.id,
          otroUsuario.email,
          otroUsuario.nombre,
          otroUsuario.apellido,
          otroUsuario.contrasena,
          otroUsuario.rolId,
          otroUsuario.telefono,
          otroUsuario.fechaRegistro,
          otroUsuario.estado,
          otroUsuario.avatarUrl,
          parseFloat(promedioPuntos.toFixed(2)),
          otroUsuario.totalIntercambios,
        );
        await this.userRepository.update(usuarioActualizado);
      }
    }

    return {
      id: savedReview.id,
      intercambio_id: savedReview.intercambioId,
      usuario_calificador_id: savedReview.usuarioCalificadorId,
      usuario_calificado_id: savedReview.usuarioCalificadoId,
      calificacion_usuario: savedReview.calificacionUsuario,
      calificacion_producto: savedReview.calificacionProducto,
      comentario: savedReview.comentario ?? undefined,
      fecha_resena: savedReview.fechaResena ?? new Date(),
    };
  }
}
