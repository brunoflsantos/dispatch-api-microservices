import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AdminCreateProductRpcInput,
  AdminFindAllProductsRpcInput,
  AdminFindOneProductRpcInput,
  AdminRemoveProductRpcInput,
  AdminUpdateProductRpcInput,
  FindManyProductsByIdsRpcInput,
  PublicFindAllProductsRpcInput,
  PublicFindOneProductRpcInput,
  ValidateAndReserveStockRpcInput,
} from 'libs/common/modules/transport/dto/catalog-rpc.input';
import {
  OrderCanceledEventInput,
  OrderCreatedEventInput,
  OrderFailedEventInput,
  OrderFailedUponCreatingEventInput,
  OrderRefundedEventInput,
} from 'libs/common/modules/transport/dto/orders-event.input';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { CATALOG_SERVICE } from './constants/catalog.token';
import type { ICatalogService } from './interfaces/catalog-service.interface';

@Controller()
export class CatalogController extends BaseController {
  constructor(@Inject(CATALOG_SERVICE) private readonly service: ICatalogService) {
    super(CatalogController.name);
  }

  //#region Products - Public

  @MessagePattern(PublicFindAllProductsRpcInput.pattern)
  publicFindAllProducts(
    @Payload() payload: PublicFindAllProductsRpcInput['payload'],
  ): Promise<PublicFindAllProductsRpcInput['response']> {
    return this.service.publicFindAllProducts(payload.query);
  }

  @MessagePattern(PublicFindOneProductRpcInput.pattern)
  publicFindOneProduct(
    @Payload() payload: PublicFindOneProductRpcInput['payload'],
  ): Promise<PublicFindOneProductRpcInput['response']> {
    return this.service.publicFindOneProduct(payload.id);
  }

  //#endregion

  //#region Products - Admin

  @MessagePattern(AdminCreateProductRpcInput.pattern)
  adminCreateProduct(
    @Payload() payload: AdminCreateProductRpcInput['payload'],
  ): Promise<AdminCreateProductRpcInput['response']> {
    return this.service.adminCreateProduct(payload.dto, payload.idempotencyKey);
  }

  @MessagePattern(AdminFindAllProductsRpcInput.pattern)
  adminFindAllProducts(
    @Payload() payload: AdminFindAllProductsRpcInput['payload'],
  ): Promise<AdminFindAllProductsRpcInput['response']> {
    return this.service.adminFindAllProducts(payload.query);
  }

  @MessagePattern(AdminFindOneProductRpcInput.pattern)
  adminFindOneProduct(
    @Payload() payload: AdminFindOneProductRpcInput['payload'],
  ): Promise<AdminFindOneProductRpcInput['response']> {
    return this.service.adminFindOneProduct(payload.id);
  }

  @MessagePattern(AdminUpdateProductRpcInput.pattern)
  adminUpdateProduct(
    @Payload() payload: AdminUpdateProductRpcInput['payload'],
  ): Promise<AdminUpdateProductRpcInput['response']> {
    return this.service.adminUpdateProduct(payload.id, payload.dto);
  }

  @MessagePattern(AdminRemoveProductRpcInput.pattern)
  async adminRemoveProduct(
    @Payload() payload: AdminRemoveProductRpcInput['payload'],
  ): Promise<AdminRemoveProductRpcInput['response']> {
    await this.service.adminRemoveProduct(payload.id);
  }

  //#endregion

  //#region Products - Internals

  @MessagePattern(FindManyProductsByIdsRpcInput.pattern)
  findManyProductsByIds(
    @Payload() payload: FindManyProductsByIdsRpcInput['payload'],
  ): Promise<FindManyProductsByIdsRpcInput['response']> {
    return this.service.findManyProductsByIds(payload.ids);
  }

  @MessagePattern(ValidateAndReserveStockRpcInput.pattern)
  validateAndReserveStock(
    @Payload() payload: ValidateAndReserveStockRpcInput['payload'],
  ): Promise<ValidateAndReserveStockRpcInput['response']> {
    return this.service.validateAndReserveStock(
      payload.orderProducts,
      payload.reserveId,
      payload.userId,
    );
  }

  //#endregion

  //#region Products - Events

  @EventPattern(OrderFailedUponCreatingEventInput.pattern)
  async eventOrderFailedUponCreating(
    @Payload() payload: OrderFailedUponCreatingEventInput['payload'],
  ): Promise<void> {
    await this.service.undoStockReservation(payload.reserveId);
  }

  @EventPattern(OrderFailedEventInput.pattern)
  async eventOrderFailed(
    @Payload() payload: OrderFailedEventInput['payload'],
  ): Promise<void> {
    await this.service.undoStockReservation(payload.reserveId);
  }

  @EventPattern(OrderCanceledEventInput.pattern)
  async eventOrderCanceled(
    @Payload() payload: OrderCanceledEventInput['payload'],
  ): Promise<void> {
    await this.service.undoStockReservation(payload.reserveId);
  }

  @EventPattern(OrderRefundedEventInput.pattern)
  async eventOrderRefunded(
    @Payload() payload: OrderRefundedEventInput['payload'],
  ): Promise<void> {
    await this.service.undoStockReservation(payload.reserveId);
  }

  @EventPattern(OrderCreatedEventInput.pattern)
  async eventOrderCreated(
    @Payload() payload: OrderCreatedEventInput['payload'],
  ): Promise<void> {
    await this.service.confirmStockReservation(payload.reserveId);
  }

  //#endregion
}
