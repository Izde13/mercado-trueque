import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTradeProposalUseCase } from '../../application/use-cases/create-trade-proposal.use-case';
import { AcceptTradeProposalUseCase } from '../../application/use-cases/accept-trade-proposal.use-case';
import { ShipTradeUseCase } from '../../application/use-cases/ship-trade.use-case';
import { ReviewTradeUseCase } from '../../application/use-cases/review-trade.use-case';
import { DeliverTradeUseCase } from '../../application/use-cases/deliver-trade.use-case';
import { RateTradeUseCase } from '../../application/use-cases/rate-trade.use-case';
import { GetReceivedProposalsUseCase } from '../../application/use-cases/get-received-proposals.use-case';
import { GetUserTradesUseCase } from '../../application/use-cases/get-user-trades.use-case';
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
import { EstadoEnvio } from '../../domain/entities/envio.entity';

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
    private readonly getReceivedProposalsUseCase: GetReceivedProposalsUseCase,
    private readonly getUserTradesUseCase: GetUserTradesUseCase,
    @Inject('EnvioRepository')
    private readonly envioRepository: any,
    @Inject('TradeProposalRepository')
    private readonly tradeProposalRepository: any,
    @Inject('ProductRepository')
    private readonly productRepository: any,
  ) {}

  /**
   * OBTENER INTERCAMBIOS DEL USUARIO
   * Retorna todos los intercambios donde el usuario está involucrado
   */
  @Get('user/:userId')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener intercambios del usuario',
    description:
      'Retorna todos los intercambios (pasados y actuales) donde el usuario está involucrado, ya sea como oferente o solicitante. Requiere autenticación.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'uuid-juan',
  })
  async getUserTrades(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<any[]> {
    // Validar que el usuario solo puede ver sus propios intercambios
    if (user.userId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para ver los intercambios de otro usuario',
      );
    }
    return await this.getUserTradesUseCase.execute(userId);
  }

  /**
   * OBTENER PROPUESTAS RECIBIDAS
   * Retorna todas las propuestas dirigidas al usuario (donde él es el receptor)
   */
  @Get('proposals/received/:userId')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener propuestas recibidas',
    description:
      'Retorna todas las propuestas que le han hecho al usuario (aquellas que solicitan sus productos). Requiere autenticación.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario receptor',
    example: 'uuid-maria',
  })
  async getReceivedProposals(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<TradeProposalResponseDto[]> {
    // Validar que el usuario solo puede ver sus propias propuestas recibidas
    if (user.userId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para ver las propuestas recibidas de otro usuario',
      );
    }
    return await this.getReceivedProposalsUseCase.execute(userId);
  }

  /**
   * FASE 1: CREAR PROPUESTA
   * Inicia el proceso de trueque creando una propuesta de intercambio
   */
  @Post('proposals')
  @Auth()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'FASE 1: Crear propuesta de trueque',
    description:
      'Inicia el proceso de trueque. Juan crea una propuesta para obtener un producto de María, ofreciendo 1-5 de sus productos a cambio. Requiere autenticación.',
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
    @CurrentUser() user: any,
  ): Promise<TradeProposalResponseDto> {
    try {
      // Validar que el usuario solo puede crear propuestas para sí mismo
      if (user.userId !== dto.usuario_oferente_id) {
        throw new BadRequestException(
          'No puedes crear una propuesta en nombre de otro usuario',
        );
      }
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
  @Auth()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'proposalId',
    description: 'ID único de la propuesta a aceptar',
    example: 'uuid-propuesta-123',
  })
  @ApiOperation({
    summary: 'FASE 2: Aceptar propuesta de trueque',
    description:
      'María (dueña del producto solicitado) acepta la propuesta. Se valida que ambos usuarios estén activos, productos disponibles y se asigna centro de distribución. Requiere autenticación.',
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
    @CurrentUser() user: any,
  ): Promise<IntercambioResponseDto> {
    try {
      // Validar que el usuario solo puede aceptar propuestas para sí mismo
      if (user.userId !== dto.usuario_aceptante_id) {
        throw new BadRequestException(
          'No puedes aceptar una propuesta en nombre de otro usuario',
        );
      }
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
  @Auth()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado INICIADO',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 3: Enviar productos al centro de distribución',
    description:
      'Ambos usuarios envían sus productos desde sus direcciones al centro de distribución. Se genera código de tracking automáticamente. Llama 2 veces (una por Juan, otra por María). Estado cambia a PRODUCTOS_ENVIADOS cuando ambos completan. Requiere autenticación.',
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
    @CurrentUser() user: any,
  ): Promise<ShippingResponseDto[]> {
    try {
      // Validar que el usuario solo puede enviar en nombre de sí mismo
      if (user.userId !== dto.usuario_id) {
        throw new BadRequestException(
          'No puedes enviar productos en nombre de otro usuario',
        );
      }
      dto.intercambio_id = intercambioId;
      return await this.shipTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * FASE 4: REVISAR PRODUCTOS
   * Centro de distribución revisa los productos recibidos
   * TODO: Proteger con rol 'admin' o 'distributor' cuando esté implementado
   */
  @Post(':intercambioId/products/:productId/review')
  @Auth()
  @ApiBearerAuth('access-token')
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
      'Centro revisa cada producto. Rating < 3 = RECHAZADO, >= 3 = APROBADO. Llamar para TODOS los productos. Cambio a EN_REVISION solo cuando AMBOS usuarios aprueban todos sus productos. Requiere autenticación (próximamente solo admin).',
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
  @Auth()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado EN_REVISION',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 5: Entregar productos a usuarios finales',
    description:
      'Centro distribuye productos a cada usuario. Llama 2 veces (Juan marca recibido, María marca recibido). Cuando AMBOS marcan como entregado, estado = COMPLETADO. Requiere autenticación.',
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
    @CurrentUser() user: any,
  ): Promise<DeliveryResponseDto> {
    try {
      // Validar que el usuario solo puede marcar entrega para sí mismo
      // if (user.userId !== dto.usuario_id) {
      //   throw new BadRequestException(
      //     'No puedes marcar entrega en nombre de otro usuario',
      //   );
      // }
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
  @Auth()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio que está en estado COMPLETADO',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'FASE 6: Calificar usuario y productos',
    description:
      'Ambos usuarios califican mutuamente. Llama 2 veces (Juan califica María, María califica Juan). Actualiza rating/reputación cuando AMBOS califican. Intercambio se queda en COMPLETADO. Requiere autenticación.',
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
    @CurrentUser() user: any,
  ): Promise<RatingResponseDto> {
    try {
      // Validar que el usuario solo puede calificar en su nombre
      if (user.userId !== dto.usuario_id) {
        throw new BadRequestException(
          'No puedes calificar en nombre de otro usuario',
        );
      }
      dto.intercambio_id = intercambioId;
      return await this.rateTradeUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * OBTENER INTERCAMBIOS PENDIENTES DE REVISIÓN
   * Endpoint para revisores: obtiene intercambios en estado PRODUCTOS_ENVIADOS
   */
  @Get('pending-review/list')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener intercambios pendientes de revisión',
    description:
      'Retorna todos los intercambios en estado PRODUCTOS_ENVIADOS que requieren revisión del centro de distribución. Solo para revisores.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de intercambios pendientes de revisión',
    isArray: true,
  })
  async getPendingReviews(@CurrentUser() user: any): Promise<any[]> {
    try {
      // Este endpoint requiere que el usuario sea revisor
      // La validación de rol se hace en el frontend con ProtectedRoute
      return await this.getUserTradesUseCase.execute('pending-review');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * OBTENER ENVÍOS DE UN INTERCAMBIO
   * Retorna todos los envíos asociados a un intercambio con sus direcciones
   */
  @Get(':intercambioId/shipments')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'intercambioId',
    description: 'ID del intercambio',
    example: 'uuid-intercambio-456',
  })
  @ApiOperation({
    summary: 'Obtener envíos de un intercambio',
    description:
      'Retorna todos los envíos (Envio) asociados a un intercambio con sus direcciones de origen.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de envíos con direcciones',
    isArray: true,
  })
  async getInterchangeShipments(
    @Param('intercambioId') intercambioId: string,
  ): Promise<any[]> {
    try {
      // Obtener todos los envíos del intercambio
      const envios =
        await this.envioRepository.findByIntercambioId(intercambioId);

      if (!envios || envios.length === 0) {
        return [];
      }

      // Enriquecer envíos con información de productos y usuarios
      const enviosEnriquecidos: any[] = [];

      for (const envio of envios) {
        const producto = await this.productRepository.findById(
          envio.productoId,
        );

        enviosEnriquecidos.push({
          id: envio.id,
          intercambio_id: envio.intercambioId,
          producto_id: envio.productoId,
          direccion_origen: envio.direccionOrigen,
          usuario_id: producto?.usuarioId,
          estado: envio.estadoEnvio,
        });
      }

      return enviosEnriquecidos;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * WEBHOOK: ACTUALIZAR ESTADO DE ENVÍO
   * Endpoint para que las transportadoras notifiquen cuando el envío llega al centro de distribución
   * Sin autenticación requerida (es un webhook externo)
   */
  @Post('envios/:envioId/update-state')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook - Actualizar estado de envío',
    description:
      'Endpoint webhook para que las transportadoras notifiquen cuando un envío llega al centro de distribución. Sin autenticación.',
  })
  @ApiParam({
    name: 'envioId',
    description: 'ID del envío a actualizar',
    example: 'uuid-envio-123',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        estado: {
          type: 'string',
          example: 'recibido_centro',
        },
        transportadora: {
          type: 'string',
          example: 'UPS',
        },
      },
      required: ['estado'],
    },
  })
  async updateShipmentState(
    @Param('envioId') envioId: string,
    @Body() dto: { estado: string; transportadora?: string },
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Obtener el envío
      const envio = await this.envioRepository.findById(envioId);

      if (!envio) {
        throw new NotFoundException('Envío no encontrado');
      }

      // Mapear string a enum de EstadoEnvio
      const estadoKey = dto.estado.toUpperCase().replace(/ /g, '_');
      const nuevoEstado = EstadoEnvio[estadoKey];

      if (!nuevoEstado) {
        throw new BadRequestException(
          `Estado inválido: ${dto.estado}. Estados válidos: ${Object.values(EstadoEnvio).join(', ')}`
        );
      }

      // Actualizar estado del envío
      let envioActualizado = envio.cambiarEstado(nuevoEstado);

      // Si se proporciona transportadora, asignarla (reasignar tracking)
      if (dto.transportadora && !envio.transportadora) {
        envioActualizado = envioActualizado.asignarTracking(
          envio.codigoTracking || 'TRK-' + envioId.substring(0, 8),
          dto.transportadora
        );
      }

      await this.envioRepository.update(envioActualizado);

      return {
        success: true,
        message: `Envío ${envioId} actualizado a estado ${dto.estado}${dto.transportadora ? ` por ${dto.transportadora}` : ''}`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al actualizar envío'
      );
    }
  }
}
