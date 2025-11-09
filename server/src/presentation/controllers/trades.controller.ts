import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTradeProposalUseCase } from '../../application/use-cases/create-trade-proposal.use-case';
import { AcceptTradeProposalUseCase } from '../../application/use-cases/accept-trade-proposal.use-case';
import { ShipTradeUseCase } from '../../application/use-cases/ship-trade.use-case';
import { ReviewTradeUseCase } from '../../application/use-cases/review-trade.use-case';
import { DeliverTradeUseCase } from '../../application/use-cases/deliver-trade.use-case';
import { RateTradeUseCase } from '../../application/use-cases/rate-trade.use-case';
import {
  CreateTradeProposalDto,
  TradeProposalResponseDto,
} from '../../application/dtos/create-trade-proposal.dto';
import {
  AcceptTradeProposalDto,
  IntercambioResponseDto,
} from '../../application/dtos/accept-trade-proposal.dto';
import {
  ShipTradeDto,
  ShippingResponseDto,
} from '../../application/dtos/ship-trade.dto';
import {
  ReviewProductDto,
  ReviewResponseDto,
} from '../../application/dtos/review-trade.dto';
import {
  DeliverTradeDto,
  DeliveryResponseDto,
} from '../../application/dtos/deliver-trade.dto';
import {
  RateTradeDto,
  RatingResponseDto,
} from '../../application/dtos/rate-trade.dto';

@Controller('trades')
export class TradesController {
  constructor(
    private readonly createProposalUseCase: CreateTradeProposalUseCase,
    private readonly acceptProposalUseCase: AcceptTradeProposalUseCase,
    private readonly shipTradeUseCase: ShipTradeUseCase,
    private readonly reviewTradeUseCase: ReviewTradeUseCase,
    private readonly deliverTradeUseCase: DeliverTradeUseCase,
    private readonly rateTradeUseCase: RateTradeUseCase,
  ) {}

  /**
   * FASE 1: CREAR PROPUESTA
   * POST /api/trades/proposals
   *
   * Validaciones:
   * - Producto solicitado activo
   * - Usuario activo
   * - Usuario con calificación >= 1.5
   * - Sin propuesta duplicada pendiente
   * - No es trueque consigo mismo
   * - 1-5 productos ofrecidos disponibles
   */
  @Post('proposals')
  @HttpCode(HttpStatus.CREATED)
  async createProposal(
    @Body() dto: CreateTradeProposalDto,
  ): Promise<TradeProposalResponseDto> {
    try {
      return await this.createProposalUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 2: ACEPTAR PROPUESTA
   * POST /api/trades/proposals/:proposalId/accept
   *
   * Validaciones:
   * - Eres dueño del producto solicitado
   * - Propuesta no expirada (< 30 días)
   * - Productos siguen disponibles
   * - Ambos usuarios activos
   * - Centro distribución disponible
   */
  @Post('proposals/:proposalId/accept')
  @HttpCode(HttpStatus.CREATED)
  async acceptProposal(
    @Param('proposalId') proposalId: string,
    @Body() dto: AcceptTradeProposalDto,
  ): Promise<IntercambioResponseDto> {
    try {
      return await this.acceptProposalUseCase.execute(
        dto.usuario_aceptante_id,
        proposalId,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 3: ENVIAR PRODUCTOS
   * POST /api/trades/:intercambioId/ship
   *
   * Validaciones:
   * - Intercambio ACEPTADA
   * - Direcciones válidas
   * - Genera código de tracking
   * - Valida costo de envío
   */
  @Post(':intercambioId/ship')
  @HttpCode(HttpStatus.CREATED)
  async shipTrade(
    @Param('intercambioId') intercambioId: string,
    @Body() dto: ShipTradeDto,
  ): Promise<ShippingResponseDto[]> {
    try {
      dto.intercambio_id = intercambioId;
      return await this.shipTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 4: REVISAR PRODUCTOS
   * POST /api/trades/:intercambioId/products/:productId/review
   *
   * Validaciones:
   * - Producto llegó al centro
   * - Rating 1-5 (< 3 = rechazado)
   * - 1-10 fotos
   * - Observaciones si rating < 4
   */
  @Post(':intercambioId/products/:productId/review')
  @HttpCode(HttpStatus.CREATED)
  async reviewProduct(
    @Param('intercambioId') intercambioId: string,
    @Param('productId') productId: string,
    @Body() dto: ReviewProductDto,
  ): Promise<ReviewResponseDto> {
    try {
      dto.intercambio_id = intercambioId;
      dto.producto_id = productId;
      return await this.reviewTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 5: ENTREGAR PRODUCTOS
   * POST /api/trades/:intercambioId/deliver
   *
   * Validaciones:
   * - Todas revisiones aprobadas
   * - Dirección confirmada
   * - Tracking actualizado
   * - Alerta si plazo vence (5 días)
   */
  @Post(':intercambioId/deliver')
  @HttpCode(HttpStatus.CREATED)
  async deliverTrade(
    @Param('intercambioId') intercambioId: string,
    @Body() dto: DeliverTradeDto,
  ): Promise<DeliveryResponseDto> {
    try {
      dto.intercambio_id = intercambioId;
      return await this.deliverTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 6: CALIFICAR
   * POST /api/trades/:intercambioId/rate
   *
   * Validaciones:
   * - Intercambio ENTREGADO/COMPLETADO
   * - Participaste en el intercambio
   * - No es auto-calificación
   * - Ratings 1-5
   * - Comentario si rating < 3 (min 20 caracteres)
   * - Sin calificación duplicada
   */
  @Post(':intercambioId/rate')
  @HttpCode(HttpStatus.CREATED)
  async rateTrade(
    @Param('intercambioId') intercambioId: string,
    @Body() dto: RateTradeDto,
  ): Promise<RatingResponseDto> {
    try {
      dto.intercambio_id = intercambioId;
      return await this.rateTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
