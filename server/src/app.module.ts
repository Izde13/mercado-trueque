import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/services/prisma.service';


// Categories
import { CategoryRepositoryImpl } from './infrastructure/repositories/category.repository.impl';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.use-case';
import { GetCategoryUseCase } from './application/use-cases/get-category.use-case';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { CategoriesController } from './presentation/controllers/categories.controller';

// Products
import { ProductRepositoryImpl } from './infrastructure/repositories/product.repository.impl';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ProductsController } from './presentation/controllers/products.controller';

// Users
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';

// Intercambios
import { IntercambioRepositoryImpl } from './infrastructure/repositories/intercambio.repository.impl';

// Envios / Shipments
import { EnvioRepositoryImpl } from './infrastructure/repositories/envio.repository.impl';
import { ShipmentRepositoryImpl } from './infrastructure/repositories/shipment.repository.impl';

// Revision Productos / Product Reviews
import { RevisionProductoRepositoryImpl } from './infrastructure/repositories/revision-producto.repository.impl';
import { ProductReviewRepositoryImpl } from './infrastructure/repositories/product-review.repository.impl';

// Respuestas Preguntas
import { RespuestaPreguntaRepositoryImpl } from './infrastructure/repositories/respuesta-pregunta.repository.impl';

// Carrito Trueque
import { CarritoTruequeRepositoryImpl } from './infrastructure/repositories/carrito-trueque.repository.impl';

// Suscripcion Alerta
import { SuscripcionAlertaRepositoryImpl } from './infrastructure/repositories/suscripcion-alerta.repository.impl';

// Alerta Activada
import { AlertaActivadaRepositoryImpl } from './infrastructure/repositories/alerta-activada.repository.impl';

// Estado Producto
import { EstadoProductoRepositoryImpl } from './infrastructure/repositories/estado-producto.repository.impl';

// Centro Distribucion
import { CentroDistribucionRepositoryImpl } from './infrastructure/repositories/centro-distribucion.repository.impl';

// Caracteristica Categoria
import { CaracteristicaCategoriaRepositoryImpl } from './infrastructure/repositories/caracteristica-categoria.repository.impl';

// Caracteristica Producto
import { CaracteristicaProductoRepositoryImpl } from './infrastructure/repositories/caracteristica-producto.repository.impl';

// Producto Propuesta
import { ProductoPropuestaRepositoryImpl } from './infrastructure/repositories/producto-propuesta.repository.impl';

// Mensaje Propuesta
import { MensajePropuestaRepositoryImpl } from './infrastructure/repositories/mensaje-propuesta.repository.impl';

// Historia Trueque
import { HistoriaTruequeRepositoryImpl } from './infrastructure/repositories/historia-trueque.repository.impl';

// Trade Proposal
import { TradeProposalRepositoryImpl } from './infrastructure/repositories/trade-proposal.repository.impl';

// Reviews
import { ReviewRepositoryImpl } from './infrastructure/repositories/review.repository.impl';

// Product Validations
import { ProductPublicationValidator } from './domain/specifications/product/product-publication.validator';
import { UserReputationLimitsRule } from './domain/specifications/product/user/user-reputation-limits.rule';
import { ForbiddenContentDetectorRule } from './domain/specifications/product/content/forbidden-content-detector.rule';
import { ActiveCategoryRule } from './domain/specifications/product/category/active-category.rule';

// Trade State Machine
import { TradeStateMachine } from './domain/state-machines/trade-state-machine';

// Trade Phase 1 - Proposal
import { ProductActiveRule } from './domain/specifications/trade/phase-1-proposal/data/product-active.rule';
import { UserActiveRule } from './domain/specifications/trade/phase-1-proposal/data/user-active.rule';
import { MinimumRatingRule } from './domain/specifications/trade/phase-1-proposal/reputation/minimum-rating.rule';
import { NoDuplicateProposalRule } from './domain/specifications/trade/phase-1-proposal/logic/no-duplicate-proposal.rule';
import { NoSelfTradeRule } from './domain/specifications/trade/phase-1-proposal/logic/no-self-trade.rule';
import { ProductsAvailableRule } from './domain/specifications/trade/phase-1-proposal/logic/products-available.rule';
import { ValueBalanceRule } from './domain/specifications/trade/phase-1-proposal/business/value-balance.rule';
import { ProposalPhaseValidator } from './domain/specifications/trade/phase-1-proposal/proposal-phase.validator';

// Trade Phase 2 - Acceptance
import { IsProposalOwnerRule } from './domain/specifications/trade/phase-2-acceptance/authorization/is-proposal-owner.rule';
import { ProposalStillPendingRule } from './domain/specifications/trade/phase-2-acceptance/state/proposal-still-pending.rule';
import { ProductsStillAvailableRule } from './domain/specifications/trade/phase-2-acceptance/state/products-still-available.rule';
import { CanCreateIntercambioRule } from './domain/specifications/trade/phase-2-acceptance/business/can-create-intercambio.rule';
import { DistributionCenterAvailableRule } from './domain/specifications/trade/phase-2-acceptance/business/distribution-center-available.rule';
import { AcceptancePhaseValidator } from './domain/specifications/trade/phase-2-acceptance/acceptance-phase.validator';

// Trade Phase 3 - Shipping
import { IntercambioAcceptedRule } from './domain/specifications/trade/phase-3-shipping/state/intercambio-accepted.rule';
import { ValidShippingAddressRule } from './domain/specifications/trade/phase-3-shipping/logistics/valid-shipping-address.rule';
import { TrackingCodeGenerationRule } from './domain/specifications/trade/phase-3-shipping/logistics/tracking-code-generation.rule';
import { ShippingCostPaymentRule } from './domain/specifications/trade/phase-3-shipping/business/shipping-cost-payment.rule';
import { ShippingPhaseValidator } from './domain/specifications/trade/phase-3-shipping/shipping-phase.validator';

// Trade Phase 4 - Review
import { ProductsReceivedAtCenterRule } from './domain/specifications/trade/phase-4-review/state/products-received-at-center.rule';
import { ProductConditionMatchesRule } from './domain/specifications/trade/phase-4-review/quality/product-condition-matches.rule';
import { PhotosUploadedRule } from './domain/specifications/trade/phase-4-review/quality/photos-uploaded.rule';
import { ObservationsIfDamagedRule } from './domain/specifications/trade/phase-4-review/quality/observations-if-damaged.rule';
import { ReviewPhaseValidator } from './domain/specifications/trade/phase-4-review/review-phase.validator';

// Trade Phase 5 - Delivery
import { ReviewApprovedRule } from './domain/specifications/trade/phase-5-delivery/state/review-approved.rule';
import { DeliveryAddressConfirmedRule } from './domain/specifications/trade/phase-5-delivery/logistics/delivery-address-confirmed.rule';
import { TrackingUpdatedRule } from './domain/specifications/trade/phase-5-delivery/logistics/tracking-updated.rule';
import { DeliveryConfirmationRule } from './domain/specifications/trade/phase-5-delivery/business/delivery-confirmation.rule';
import { DeliveryPhaseValidator } from './domain/specifications/trade/phase-5-delivery/delivery-phase.validator';

// Trade Phase 6 - Rating
import { TradeDeliveredRule } from './domain/specifications/trade/phase-6-rating/state/trade-delivered.rule';
import { CanRateUserRule } from './domain/specifications/trade/phase-6-rating/authorization/can-rate-user.rule';
import { RatingRangeRule } from './domain/specifications/trade/phase-6-rating/validation/rating-range.rule';
import { CommentRequiredIfLowRule } from './domain/specifications/trade/phase-6-rating/validation/comment-required-if-low.rule';
import { DuplicateRatingRule } from './domain/specifications/trade/phase-6-rating/validation/duplicate-rating.rule';
import { RatingPhaseValidator } from './domain/specifications/trade/phase-6-rating/rating-phase.validator';

// Command Pattern
import { CommandBus } from './domain/commands/base/command-bus';

// Event Bus
import { EventBus } from './domain/events/base/event-bus';

// Saga Pattern
import { SagaOrchestrator } from './domain/sagas/base/saga-orchestrator';

// Estados Producto
import { EstadosProductoController } from './presentation/controllers/estados-producto.controller';

// Trade Use Cases
import { CreateTradeProposalUseCase } from './application/use-cases/create-trade-proposal.use-case';
import { AcceptTradeProposalUseCase } from './application/use-cases/accept-trade-proposal.use-case';
import { ShipTradeUseCase } from './application/use-cases/ship-trade.use-case';
import { ReviewTradeUseCase } from './application/use-cases/review-trade.use-case';
import { DeliverTradeUseCase } from './application/use-cases/deliver-trade.use-case';
import { RateTradeUseCase } from './application/use-cases/rate-trade.use-case';
import { GetReceivedProposalsUseCase } from './application/use-cases/get-received-proposals.use-case';
import { GetUserTradesUseCase } from './application/use-cases/get-user-trades.use-case';

// Trade Controllers
import { TradesController } from './presentation/controllers/trades.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule, // Integración del módulo de autenticación
  ],
  controllers: [
    AppController,
    CategoriesController,
    ProductsController,
    EstadosProductoController,
    TradesController,
  ],
  providers: [
    AppService,
    PrismaService,
    // Categories
    {
      provide: 'CategoryRepository',
      useClass: CategoryRepositoryImpl,
    },
    GetCategoriesUseCase,
    GetCategoryUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    // Products
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryImpl,
    },
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductUseCase,
    // Users
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    // Intercambios
    {
      provide: 'IntercambioRepository',
      useClass: IntercambioRepositoryImpl,
    },
    // Envios
    {
      provide: 'EnvioRepository',
      useClass: EnvioRepositoryImpl,
    },
    // Shipments
    {
      provide: 'ShipmentRepository',
      useClass: ShipmentRepositoryImpl,
    },
    // Revision Productos
    {
      provide: 'RevisionProductoRepository',
      useClass: RevisionProductoRepositoryImpl,
    },
    // Product Reviews
    {
      provide: 'ProductReviewRepository',
      useClass: ProductReviewRepositoryImpl,
    },
    // Respuestas Preguntas
    {
      provide: 'RespuestaPreguntaRepository',
      useClass: RespuestaPreguntaRepositoryImpl,
    },
    // Carrito Trueque
    {
      provide: 'CarritoTruequeRepository',
      useClass: CarritoTruequeRepositoryImpl,
    },
    // Suscripcion Alerta
    {
      provide: 'SuscripcionAlertaRepository',
      useClass: SuscripcionAlertaRepositoryImpl,
    },
    // Alerta Activada
    {
      provide: 'AlertaActivadaRepository',
      useClass: AlertaActivadaRepositoryImpl,
    },
    // Estado Producto
    {
      provide: 'EstadoProductoRepository',
      useClass: EstadoProductoRepositoryImpl,
    },
    // Centro Distribucion
    {
      provide: 'CentroDistribucionRepository',
      useClass: CentroDistribucionRepositoryImpl,
    },
    // Caracteristica Categoria
    {
      provide: 'CaracteristicaCategoriaRepository',
      useClass: CaracteristicaCategoriaRepositoryImpl,
    },
    // Caracteristica Producto
    {
      provide: 'CaracteristicaProductoRepository',
      useClass: CaracteristicaProductoRepositoryImpl,
    },
    // Producto Propuesta
    {
      provide: 'ProductoPropuestaRepository',
      useClass: ProductoPropuestaRepositoryImpl,
    },
    // Mensaje Propuesta
    {
      provide: 'MensajePropuestaRepository',
      useClass: MensajePropuestaRepositoryImpl,
    },
    // Historia Trueque
    {
      provide: 'HistoriaTruequeRepository',
      useClass: HistoriaTruequeRepositoryImpl,
    },
    // Trade Proposal
    {
      provide: 'TradeProposalRepository',
      useClass: TradeProposalRepositoryImpl,
    },
    // Reviews
    {
      provide: 'ReviewRepository',
      useClass: ReviewRepositoryImpl,
    },
    // Product Validations
    ProductPublicationValidator,
    UserReputationLimitsRule,
    ForbiddenContentDetectorRule,
    ActiveCategoryRule,
    // Trade State Machine
    TradeStateMachine,
    // Trade Phase 1 - Proposal
    ProductActiveRule,
    UserActiveRule,
    MinimumRatingRule,
    NoDuplicateProposalRule,
    NoSelfTradeRule,
    ProductsAvailableRule,
    ValueBalanceRule,
    ProposalPhaseValidator,
    // Trade Phase 2 - Acceptance
    IsProposalOwnerRule,
    ProposalStillPendingRule,
    ProductsStillAvailableRule,
    CanCreateIntercambioRule,
    DistributionCenterAvailableRule,
    AcceptancePhaseValidator,
    // Trade Phase 3 - Shipping
    IntercambioAcceptedRule,
    ValidShippingAddressRule,
    TrackingCodeGenerationRule,
    ShippingCostPaymentRule,
    ShippingPhaseValidator,
    // Trade Phase 4 - Review
    ProductsReceivedAtCenterRule,
    ProductConditionMatchesRule,
    PhotosUploadedRule,
    ObservationsIfDamagedRule,
    ReviewPhaseValidator,
    // Trade Phase 5 - Delivery
    ReviewApprovedRule,
    DeliveryAddressConfirmedRule,
    TrackingUpdatedRule,
    DeliveryConfirmationRule,
    DeliveryPhaseValidator,
    // Trade Phase 6 - Rating
    TradeDeliveredRule,
    CanRateUserRule,
    RatingRangeRule,
    CommentRequiredIfLowRule,
    DuplicateRatingRule,
    RatingPhaseValidator,
    // Command Pattern
    CommandBus,
    // Event Bus
    EventBus,
    // Saga Pattern
    SagaOrchestrator,
    // Trade Use Cases
    CreateTradeProposalUseCase,
    AcceptTradeProposalUseCase,
    ShipTradeUseCase,
    ReviewTradeUseCase,
    DeliverTradeUseCase,
    RateTradeUseCase,
    GetReceivedProposalsUseCase,
    GetUserTradesUseCase,
  ],
})
export class AppModule {}
