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
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
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

@ApiTags('Trades')
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
   * Inicia el proceso de trueque creando una propuesta de intercambio
   */
  @Post('proposals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'FASE 1: Crear propuesta de trueque',
    description:
      'Inicia el proceso de trueque. Juan crea una propuesta para obtener un producto de María, ofreciendo 1-5 de sus productos a cambio.',
  })
  @ApiBody({
    type: CreateTradeProposalDto,
    examples: {
      example1: {
        summary: 'Propuesta simple - 1 producto ofrecido',
        value: {
          usuario_oferente_id: 'uuid-juan',
          producto_solicitado_id: 'uuid-producto-maria',
          offered_product_ids: ['uuid-producto-juan-1'],
        },
      },
      example2: {
        summary: 'Propuesta múltiple - 3 productos ofrecidos',
        value: {
          usuario_oferente_id: 'uuid-juan',
          producto_solicitado_id: 'uuid-producto-maria',
          offered_product_ids: [
            'uuid-producto-juan-1',
            'uuid-producto-juan-2',
            'uuid-producto-juan-3',
          ],
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: TradeProposalResponseDto,
    description:
      'Propuesta creada exitosamente. Está en estado PENDIENTE hasta que María la acepte o rechace.',
  })
  @ApiBadRequestResponse({
    description:
      'Error: Producto no disponible, usuario sin calificación, propuesta duplicada, o no hay productos válidos',
  })
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
   * María acepta la propuesta de Juan y se crea el intercambio
   */
  @Post('proposals/:proposalId/accept')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'proposalId',
    description: 'ID único de la propuesta a aceptar',
    example: 'uuid-propuesta-123',
  })
  @ApiOperation({
    summary: 'FASE 2: Aceptar propuesta de trueque',
    description:
      'María (dueña del producto solicitado) acepta la propuesta. Se valida que ambos usuarios estén activos, productos disponibles y se asigna centro de distribución.',
  })
  @ApiBody({
    type: AcceptTradeProposalDto,
    examples: {
      example1: {
        summary: 'María acepta propuesta',
        value: {
          usuario_aceptante_id: 'uuid-maria',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: IntercambioResponseDto,
    description:
      'Intercambio creado exitosamente. Estado = INICIADO. Ahora ambos usuarios deben enviar sus productos.',
  })
  @ApiBadRequestResponse({
    description:
      'Error: No eres dueño del producto, propuesta expirada, productos no disponibles, etc.',
  })
  @ApiNotFoundResponse({
    description: 'Propuesta no encontrada',
  })
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
   * Tanto Juan como María envían sus productos al centro de distribución
   */
  @Post(':intercambioId/ship')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado INICIADO',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 3: Enviar productos al centro de distribución',
    description:
      'Ambos usuarios envían sus productos desde sus direcciones al centro de distribución. Se genera código de tracking automáticamente. Llama 2 veces (una por Juan, otra por María). Estado cambia a PRODUCTOS_ENVIADOS cuando ambos completan.',
  })
  @ApiBody({
    type: ShipTradeDto,
    examples: {
      example1: {
        summary: 'Juan envía sus productos',
        value: {
          usuario_id: 'uuid-juan',
          origen_direccion: 'Calle Principal 123, Bogotá',
          destino_direccion: 'Centro Distribución - Bogotá',
          notas: 'Empaquetado con cuidado',
        },
      },
      example2: {
        summary: 'María envía su producto',
        value: {
          usuario_id: 'uuid-maria',
          origen_direccion: 'Carrera 7 456, Bogotá',
          destino_direccion: 'Centro Distribución - Bogotá',
          notas: 'Artículo nuevo sin usar',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: [ShippingResponseDto],
    description:
      'Envíos creados. Cuando ambos usuarios completan, estado = PRODUCTOS_ENVIADOS',
  })
  @ApiBadRequestResponse({
    description:
      'Error: Usuario no involucrado en intercambio, intercambio no en estado correcto, etc.',
  })
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
   * Centro de distribución revisa los productos recibidos
   */
  @Post(':intercambioId/products/:productId/review')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado PRODUCTOS_ENVIADOS',
    example: 'uuid-intercambio-456',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID del producto a revisar',
    example: 'uuid-producto-789',
  })
  @ApiOperation({
    summary: 'FASE 4: Revisar producto en centro de distribución',
    description:
      'Centro revisa cada producto. Rating < 3 = RECHAZADO, >= 3 = APROBADO. Llamar para TODOS los productos. Cambio a EN_REVISION solo cuando AMBOS usuarios aprueban todos sus productos.',
  })
  @ApiBody({
    type: ReviewProductDto,
    examples: {
      example1: {
        summary: 'Producto aprobado',
        value: {
          condition_rating: 5,
          observations: 'Estado excelente, como nuevo',
          photos: ['url-foto-1.jpg', 'url-foto-2.jpg'],
        },
      },
      example2: {
        summary: 'Producto rechazado',
        value: {
          condition_rating: 2,
          observations: 'Daño visible, no cumple requisitos',
          photos: ['url-foto-dano.jpg'],
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: ReviewResponseDto,
    description:
      'Revisión registrada. Cambia a EN_REVISION cuando AMBOS usuarios tienen todos sus productos APROBADOS.',
  })
  @ApiBadRequestResponse({
    description: 'Error: Producto no encontrado, validaciones fallidas, etc.',
  })
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
   * Centro distribuye los productos a sus destinos finales
   */
  @Post(':intercambioId/deliver')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado EN_REVISION',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 5: Entregar productos a usuarios finales',
    description:
      'Centro distribuye productos a cada usuario. Llama 2 veces (Juan marca recibido, María marca recibido). Cuando AMBOS marcan como entregado, estado = COMPLETADO.',
  })
  @ApiBody({
    type: DeliverTradeDto,
    examples: {
      example1: {
        summary: 'Juan marca sus productos como entregados',
        value: {
          usuario_id: 'uuid-juan',
          delivery_address: 'Calle Principal 123, Bogotá',
          notas: 'Entregado en mano',
        },
      },
      example2: {
        summary: 'María marca su producto como entregado',
        value: {
          usuario_id: 'uuid-maria',
          delivery_address: 'Carrera 7 456, Bogotá',
          notas: 'Entregado en mano',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: DeliveryResponseDto,
    description:
      'Entrega registrada. Cambia a COMPLETADO cuando AMBOS usuarios marcan como entregado.',
  })
  @ApiBadRequestResponse({
    description: 'Error: Usuario no involucrado, revisiones no aprobadas, etc.',
  })
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
   * Usuarios califican mutuamente al finalizar el intercambio
   */
  @Post(':intercambioId/rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado COMPLETADO',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 6: Calificar usuario y productos',
    description:
      'Ambos usuarios califican mutuamente. Llama 2 veces (Juan califica María, María califica Juan). Actualiza rating/reputación cuando AMBOS califican. Intercambio se queda en COMPLETADO.',
  })
  @ApiBody({
    type: RateTradeDto,
    examples: {
      example1: {
        summary: 'Juan califica a María con 5 estrellas',
        value: {
          usuario_id: 'uuid-juan',
          usuario_calificado_id: 'uuid-maria',
          calificacion_usuario: 5,
          calificacion_producto: 5,
          comentario: 'Excelente usuario, producto en perfecto estado',
        },
      },
      example2: {
        summary: 'María califica a Juan con 4 estrellas',
        value: {
          usuario_id: 'uuid-maria',
          usuario_calificado_id: 'uuid-juan',
          calificacion_usuario: 4,
          calificacion_producto: 4,
          comentario: 'Buen usuario, comunicación clara',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: RatingResponseDto,
    description:
      'Calificación registrada. Actualiza reputación de AMBOS cuando el segundo usuario califica.',
  })
  @ApiBadRequestResponse({
    description:
      'Error: Usuario no involucrado, ya calificaste, intercambio no completado, etc.',
  })
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
