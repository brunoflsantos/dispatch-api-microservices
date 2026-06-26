import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { LOCK_KEYS } from 'libs/common/modules/cache/constants/lock-keys.constant';
import { IdempotencyService } from 'libs/common/modules/cache/providers/idempotency.service';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { OUTBOX_SERVICE } from 'libs/common/modules/outbox/constants/outbox.token';
import type { IOutboxService } from 'libs/common/modules/outbox/interfaces/outbox-service.interface';
import { ValidateAndReserveStockRpcInput } from 'libs/common/modules/transport/dto/catalog-rpc.input';
import {
  OrderCanceledEventInput,
  OrderCreatedEventInput,
  OrderDeliveredEventInput,
  OrderFailedEventInput,
  OrderFailedUponCreatingEventInput,
  OrderPaidEventInput,
  OrderRefundedEventInput,
  OrderShippedEventInput,
  OrderStatusChangedEventInput,
} from 'libs/common/modules/transport/dto/orders-event.input';
import { CatalogRpcClient } from 'libs/common/modules/transport/providers/catalog-rpc-client';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { template } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateOrderInput } from 'libs/contracts/interfaces/orders/create-order-input.interface';
import {
  OrderByUserCursorQueryInput,
  OrderCursorQueryInput,
} from 'libs/contracts/interfaces/orders/order-cursor-query-input.interface';
import {
  OrderResult,
  PublicOrderResult,
} from 'libs/contracts/interfaces/orders/order-result.interface';
import { ShipOrderInput } from 'libs/contracts/interfaces/orders/ship-order-input.interface';
import { UpdateOrderInput } from 'libs/contracts/interfaces/orders/update-order-input.interface';
import { UpdateOrderPaymentInput } from 'libs/contracts/interfaces/orders/update-order-payment-input.interface';
import { ProductResult } from 'libs/contracts/interfaces/products/product-result.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { I18N_ORDERS } from './constants/i18n.constant';
import {
  ORDER_PRODUCT_REPOSITORY,
  ORDER_REPOSITORY,
} from './constants/orders.token';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto, PublicOrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';
import { calculateTotal } from './helpers/order-functions';
import { OrderTransitionPolicy } from './helpers/order-transition-policy';
import type { IOrderProductRepository } from './interfaces/order-product-repository.interface';
import type { IOrderRepository } from './interfaces/order-repository.interface';
import { IOrdersService } from './interfaces/orders-service.interface';

@Injectable()
export class OrdersService extends BaseService implements IOrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    @Inject(ORDER_PRODUCT_REPOSITORY)
    private readonly orderProductRepository: IOrderProductRepository,
    @Inject(OUTBOX_SERVICE) private readonly outboxService: IOutboxService,
    private readonly catalogRpcClient: CatalogRpcClient,
    private readonly idempotencyService: IdempotencyService,
    private readonly guard: DbGuardService,
  ) {
    super(OrdersService.name);
  }

  //#region Orders - Public

  publicCreate(
    dto: CreateOrderInput,
    reqUser: RequestUser,
    idempotencyKey: string,
  ): Promise<PublicOrderResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.ORDERS.CREATE(idempotencyKey),
      async () =>
        this.idempotencyService.getOrExecute(
          CACHE_KEYS.ORDERS.IDEMPOTENCY('create', idempotencyKey),
          () => this._publicCreate(dto, reqUser),
        ),
    );
  }

  private async _publicCreate(
    dto: CreateOrderInput,
    reqUser: RequestUser,
  ): Promise<PublicOrderResult> {
    // Validate and reserve stock
    const reserveId = crypto.randomUUID();
    const catalogProducts = await this.catalogRpcClient.call(
      new ValidateAndReserveStockRpcInput({
        userId: reqUser.id,
        orderProducts: dto.products,
        reserveId,
      }),
    );

    try {
      const saved = await this.createOrderWithProducts(
        dto,
        reqUser.id,
        catalogProducts,
      );

      // Expected side effects: notify user and confirm stock reservation
      await this.outboxService.add(
        new OrderCreatedEventInput({
          orderTotal: saved.total,
          userId: reqUser.id,
          orderId: saved.id,
          reserveId,
        }),
      );

      return EntityMapper.map(saved, PublicOrderResponseDto);
    } catch (e) {
      // Expected side effects: notify user and release reserved stock
      await this.outboxService.add(
        new OrderFailedUponCreatingEventInput({
          userId: reqUser.id,
          reserveId,
        }),
      );
      throw e;
    }
  }

  async publicFindByUser(
    query: OrderByUserCursorQueryInput,
    reqUser: RequestUser,
  ): Promise<PagCursorResultDto<PublicOrderResult>> {
    const result = await this.orderRepository.filter({
      ...query,
      userId: reqUser.id,
    });

    this.logger.debug(`Found ${result.items.length} orders for user ${reqUser.id}`);

    return new PagCursorResultDto<PublicOrderResponseDto>(
      EntityMapper.mapArray(result.items, PublicOrderResponseDto),
      result.nextCursor,
      result.hasMore,
    );
  }

  async publicFindOne(
    id: string,
    requestUser: RequestUser,
  ): Promise<PublicOrderResult> {
    const order = await this.getOrderOrThrow(id);
    if (order.userId !== requestUser.id) {
      throw new ForbiddenException(template(I18N_ORDERS.ERRORS.ACCESS_DENIED));
    }

    this.logger.debug('Found order', { orderId: id });

    return EntityMapper.map(order, PublicOrderResponseDto);
  }

  publicCancel(id: string): Promise<void> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.UPDATE(id), async () =>
      this._publicCancel(id),
    );
  }

  private async _publicCancel(id: string): Promise<void> {
    const order = await this.getOrderOrThrow(id);

    this.assertOrderTransitionIsValid(order, OrderStatus.CANCELED);

    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);

    // Expected side effects: notify user and release reserved stock
    await this.outboxService.add(
      new OrderCanceledEventInput({
        userId: order.userId,
        orderId: order.id,
        reserveId: order.reserveId,
      }),
    );

    this.logger.debug('Order cancel enqueued', { orderId: id });
  }

  //#endregion

  //#region Orders - Admin

  async adminFindAll(
    query: OrderCursorQueryInput,
  ): Promise<PagCursorResultDto<OrderResult>> {
    const result = await this.orderRepository.filter(query);

    this.logger.debug(`Found ${result.items.length} orders`);

    return new PagCursorResultDto<OrderResponseDto>(
      EntityMapper.mapArray(result.items, OrderResponseDto),
      result.nextCursor,
      result.hasMore,
    );
  }

  async adminFindOne(id: string): Promise<OrderResult> {
    const order = await this.getOrderOrThrow(id);

    this.logger.debug('Found order', { orderId: id });

    return EntityMapper.map(order, OrderResponseDto);
  }

  adminUpdate(id: string, dto: UpdateOrderInput): Promise<OrderResult> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.UPDATE(id), async () =>
      this._adminUpdate(id, dto),
    );
  }

  private async _adminUpdate(
    id: string,
    dto: UpdateOrderInput,
  ): Promise<OrderResult> {
    const order = await this.getOrderOrThrow(id);

    Object.assign(order, dto);
    await this.orderRepository.save(order);

    // Expected side effects: notify user
    await this.outboxService.add(
      new OrderStatusChangedEventInput({
        userId: order.userId,
        orderId: order.id,
        orderNewStatus: order.status,
      }),
    );

    this.logger.debug('Order updated', { orderId: id });

    return EntityMapper.map(order, OrderResponseDto);
  }

  adminRemove(id: string): Promise<void> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.REMOVE(id), async () =>
      this._adminRemove(id),
    );
  }

  private async _adminRemove(id: string): Promise<void> {
    const order = await this.getOrderOrThrow(id);

    await this.orderRepository.softRemove(order);

    this.logger.debug('Order deactivated', { orderId: id });
  }

  adminShip(id: string, dto: ShipOrderInput): Promise<OrderResult> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.UPDATE(id), async () =>
      this._adminShip(id, dto),
    );
  }

  private async _adminShip(id: string, dto: ShipOrderInput): Promise<OrderResult> {
    const order = await this.getOrderOrThrow(id);

    this.assertOrderTransitionIsValid(order, OrderStatus.SHIPPED);

    order.status = OrderStatus.SHIPPED;
    order.shippedAt = new Date();
    if (dto.trackingNumber !== undefined) order.trackingNumber = dto.trackingNumber;
    if (dto.carrier !== undefined) order.carrier = dto.carrier;

    await this.orderRepository.save(order);

    // Expected side effects: notify user
    await this.outboxService.add(
      new OrderShippedEventInput({
        userId: order.userId,
        orderId: order.id,
        trackingNumber: order.trackingNumber ?? '',
      }),
    );

    this.logger.debug('Order shipped', { orderId: id });

    return EntityMapper.map(order, OrderResponseDto);
  }

  adminDeliver(id: string): Promise<OrderResult> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.UPDATE(id), async () =>
      this._adminDeliver(id),
    );
  }

  private async _adminDeliver(id: string): Promise<OrderResponseDto> {
    const order = await this.getOrderOrThrow(id);

    this.assertOrderTransitionIsValid(order, OrderStatus.DELIVERED);

    order.status = OrderStatus.DELIVERED;
    order.deliveredAt = new Date();

    await this.orderRepository.save(order);

    // Expected side effects: notify user
    await this.outboxService.add(
      new OrderDeliveredEventInput({
        userId: order.userId,
        orderId: order.id,
        deliveryDate: order.deliveredAt.toISOString(),
      }),
    );

    this.logger.debug('Order delivered', { orderId: id });
    return EntityMapper.map(order, OrderResponseDto);
  }

  adminRefund(id: string): Promise<void> {
    return this.guard.lockAndTransaction(LOCK_KEYS.ORDERS.UPDATE(id), async () =>
      this._adminRefund(id),
    );
  }

  private async _adminRefund(id: string): Promise<void> {
    const order = await this.getOrderOrThrow(id);

    this.assertOrderTransitionIsValid(order, OrderStatus.REFUNDED);

    // Expected side effects: notify user and process refund in payment gateway
    await this.outboxService.add(
      new OrderRefundedEventInput({
        userId: order.userId,
        orderId: order.id,
        reserveId: order.reserveId,
        refundAmount: order.total,
        idempotencyKey: crypto.randomUUID(),
      }),
    );

    this.logger.debug('Order refund enqueued', { orderId: id });
  }

  //#endregion

  //#region Orders - Internal

  markPaymentAsSucceeded(dto: UpdateOrderPaymentInput): Promise<OrderResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.ORDERS.UPDATE(dto.orderId),
      async () => this._markPaymentAsSucceeded(dto),
    );
  }

  private async _markPaymentAsSucceeded(
    dto: UpdateOrderPaymentInput,
  ): Promise<OrderResult> {
    const order = await this.getOrderOrThrow(dto.orderId);

    order.paymentId = dto.paymentId;
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);

    // Expected side effects: notify user and start order processing
    await this.outboxService.add(
      new OrderPaidEventInput({
        userId: order.userId,
        orderId: order.id,
        paymentId: order.paymentId,
        reserveId: order.reserveId,
      }),
    );

    return EntityMapper.map(order, OrderResponseDto);
  }

  markPaymentAsFailed(dto: UpdateOrderPaymentInput): Promise<OrderResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.ORDERS.UPDATE(dto.orderId),
      async () => this._markPaymentAsFailed(dto),
    );
  }

  private async _markPaymentAsFailed(
    dto: UpdateOrderPaymentInput,
  ): Promise<OrderResult> {
    const order = await this.getOrderOrThrow(dto.orderId);

    order.paymentId = dto.paymentId;
    order.status = OrderStatus.FAILED;
    await this.orderRepository.save(order);

    // Expected side effects: notify user and release reserved stock
    await this.outboxService.add(
      new OrderFailedEventInput({
        userId: order.userId,
        orderId: order.id,
        reserveId: order.reserveId,
      }),
    );

    return EntityMapper.map(order, OrderResponseDto);
  }

  //#endregion

  //#region Private

  private async getOrderOrThrow(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id, {
      relations: ['user', 'items'],
    });
    if (!order) {
      throw new NotFoundException(template(I18N_ORDERS.ERRORS.ORDER_NOT_FOUND));
    }
    return order;
  }

  private async createOrderWithProducts(
    dto: CreateOrderDto,
    userId: string,
    catalogProducts: ProductResult[],
  ): Promise<Order> {
    const total = calculateTotal(dto.products, catalogProducts);

    const order = this.orderRepository.createEntity({
      userId,
      total,
      reserveId: dto.reserveId,
    });
    const saved = await this.orderRepository.save(order);

    const orderProducts = dto.products.map((dtoProduct) =>
      this.orderProductRepository.createEntity({
        productId: dtoProduct.productId,
        quantity: dtoProduct.quantity,
        orderId: saved.id,
      }),
    );

    saved.products = await this.orderProductRepository.saveBulk(orderProducts);

    return saved;
  }

  private assertOrderTransitionIsValid(order: Order, newStatus: OrderStatus): void {
    if (!OrderTransitionPolicy.canTransition(order.status, newStatus)) {
      throw new BadRequestException(
        template(I18N_ORDERS.ERRORS.BAD_PRECONDITIONS, {
          status: newStatus,
          currentStatus: order.status,
        }),
      );
    }
  }

  //#endregion
}
