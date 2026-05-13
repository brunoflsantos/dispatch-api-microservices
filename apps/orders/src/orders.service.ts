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
import { ValidateAndGetProductsRpcInput } from 'libs/common/modules/transport/dto/catalog-rpc.input';
import { CatalogRpcClient } from 'libs/common/modules/transport/providers/catalog-rpc-client';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { template } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { CreateOrderInput } from 'libs/contracts/interfaces/orders/create-order-input.interface';
import {
  OrderByUserQueryInput,
  OrderQueryInput,
} from 'libs/contracts/interfaces/orders/order-query-input.interface';
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
    const catalogProducts = await this.catalogRpcClient.call(
      new ValidateAndGetProductsRpcInput({
        ids: dto.products.map((i) => i.productId),
      }),
    );

    // TODO: reserve products in catalog service with a lock or similar mechanism to
    // prevent overselling, and handle rollbacks if payment fails, etc.

    const saved = await this.createOrderWithProducts(
      dto,
      reqUser.id,
      catalogProducts,
    );

    // TODO: handle payment creation and update order with payment info

    // TODO: handle stock decrement in a more robust way, considering rollbacks if
    // payment fails, etc.

    return EntityMapper.map(saved, PublicOrderResponseDto);
  }

  async publicFindByUser(
    queryDto: OrderByUserQueryInput,
    reqUser: RequestUser,
  ): Promise<PagOffsetResultDto<PublicOrderResult>> {
    const result = await this.orderRepository.filter({
      ...queryDto,
      userId: reqUser.id,
    });

    this.logger.debug(`Found ${result.items.length} orders for user ${reqUser.id}`, {
      page: queryDto.page,
      totalPages: result.meta.totalPages,
    });

    return new PagOffsetResultDto<PublicOrderResponseDto>(
      result.meta.total,
      result.meta.page,
      result.meta.limit,
      EntityMapper.mapArray(result.items, PublicOrderResponseDto),
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

    if (!OrderTransitionPolicy.canTransition(order.status, OrderStatus.CANCELED)) {
      throw new BadRequestException(
        template(I18N_ORDERS.ERRORS.BAD_PRECONDITIONS, {
          status: OrderStatus.CANCELED,
          currentStatus: order.status,
        }),
      );
    }

    // TODO: cancel payment if already created, etc.

    this.logger.debug('Order cancel enqueued', { orderId: id });
  }

  //#endregion

  //#region Orders - Admin

  async adminFindAll(
    queryDto: OrderQueryInput,
  ): Promise<PagOffsetResultDto<OrderResult>> {
    const result = await this.orderRepository.filter(queryDto);

    this.logger.debug(`Found ${result.items.length} orders`, {
      page: queryDto.page,
      totalPages: result.meta.totalPages,
    });

    return new PagOffsetResultDto<OrderResponseDto>(
      result.meta.total,
      result.meta.page,
      result.meta.limit,
      EntityMapper.mapArray(result.items, OrderResponseDto),
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

    // TODO: notify the user about the update, if relevant (e.g. if status changed)

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

    if (!OrderTransitionPolicy.canTransition(order.status, OrderStatus.SHIPPED)) {
      throw new BadRequestException(
        template(I18N_ORDERS.ERRORS.BAD_PRECONDITIONS, {
          status: OrderStatus.SHIPPED,
          currentStatus: order.status,
        }),
      );
    }

    order.status = OrderStatus.SHIPPED;
    order.shippedAt = new Date();
    if (dto.trackingNumber !== undefined) order.trackingNumber = dto.trackingNumber;
    if (dto.carrier !== undefined) order.carrier = dto.carrier;

    await this.orderRepository.save(order);

    // TODO: notify the user about the shipment, with tracking info, etc.

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

    if (!OrderTransitionPolicy.canTransition(order.status, OrderStatus.DELIVERED)) {
      throw new BadRequestException(
        template(I18N_ORDERS.ERRORS.BAD_PRECONDITIONS, {
          status: OrderStatus.DELIVERED,
          currentStatus: order.status,
        }),
      );
    }

    order.status = OrderStatus.DELIVERED;
    order.deliveredAt = new Date();

    await this.orderRepository.save(order);

    // TODO: notify the user about the delivery, etc.

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

    if (!OrderTransitionPolicy.canTransition(order.status, OrderStatus.REFUNDED)) {
      throw new BadRequestException(
        template(I18N_ORDERS.ERRORS.BAD_PRECONDITIONS, {
          status: OrderStatus.REFUNDED,
          currentStatus: order.status,
        }),
      );
    }

    // TODO: process the refund, notify the user, etc.

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
    order.paymentStatus = dto.paymentStatus;
    order.status = OrderStatus.PAID;

    await this.orderRepository.save(order);

    // TODO: process order after payment, notify the user, etc.

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
    order.paymentStatus = dto.paymentStatus;

    await this.orderRepository.save(order);

    // TODO: handle payment failure, notify the user, etc.

    return EntityMapper.map(order, OrderResponseDto);
  }

  //#endregion

  //#region Private helper methods

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

    const order = this.orderRepository.createEntity({ userId, total });
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

  //#endregion
}
