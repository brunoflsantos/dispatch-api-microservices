import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderPaidEventInput } from 'libs/common/modules/transport/dto/orders-event.input';
import {
  AdminDeliverOrderRpcInput,
  AdminFindAllOrdersRpcInput,
  AdminFindOneOrderRpcInput,
  AdminRefundOrderRpcInput,
  AdminRemoveOrderRpcInput,
  AdminShipOrderRpcInput,
  AdminUpdateOrderRpcInput,
  PublicCancelOrderRpcInput,
  PublicCreateOrderRpcInput,
  PublicFindOneOrderRpcInput,
  PublicFindOrdersByUserRpcInput,
} from 'libs/common/modules/transport/dto/orders-rpc.input';
import { ORDERS_SERVICE } from './constants/orders.token';
import type { IOrdersService } from './interfaces/orders-service.interface';

@Controller()
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersService: IOrdersService,
  ) {}

  //#region Public

  @MessagePattern(PublicCreateOrderRpcInput.pattern)
  publicCreate(
    @Payload() payload: PublicCreateOrderRpcInput['payload'],
  ): Promise<PublicCreateOrderRpcInput['response']> {
    return this.ordersService.publicCreate(
      payload.dto,
      payload.reqUser,
      payload.idempotencyKey,
    );
  }

  @MessagePattern(PublicFindOrdersByUserRpcInput.pattern)
  publicFindOrdersByUser(
    @Payload() payload: PublicFindOrdersByUserRpcInput['payload'],
  ): Promise<PublicFindOrdersByUserRpcInput['response']> {
    return this.ordersService.publicFindByUser(payload.query, payload.reqUser);
  }

  @MessagePattern(PublicFindOneOrderRpcInput.pattern)
  publicFindOne(
    @Payload() payload: PublicFindOneOrderRpcInput['payload'],
  ): Promise<PublicFindOneOrderRpcInput['response']> {
    return this.ordersService.publicFindOne(payload.id, payload.reqUser);
  }

  @MessagePattern(PublicCancelOrderRpcInput.pattern)
  publicCancel(
    @Payload() payload: PublicCancelOrderRpcInput['payload'],
  ): Promise<PublicCancelOrderRpcInput['response']> {
    return this.ordersService.publicCancel(payload.id);
  }

  //#endregion

  //#region Admin

  @MessagePattern(AdminFindAllOrdersRpcInput.pattern)
  adminFindAll(
    @Payload() payload: AdminFindAllOrdersRpcInput['payload'],
  ): Promise<AdminFindAllOrdersRpcInput['response']> {
    return this.ordersService.adminFindAll(payload.query);
  }

  @MessagePattern(AdminFindOneOrderRpcInput.pattern)
  adminFindOne(
    @Payload() payload: AdminFindOneOrderRpcInput['payload'],
  ): Promise<AdminFindOneOrderRpcInput['response']> {
    return this.ordersService.adminFindOne(payload.id);
  }

  @MessagePattern(AdminUpdateOrderRpcInput.pattern)
  adminUpdate(
    @Payload() payload: AdminUpdateOrderRpcInput['payload'],
  ): Promise<AdminUpdateOrderRpcInput['response']> {
    return this.ordersService.adminUpdate(payload.id, payload.dto);
  }

  @MessagePattern(AdminRemoveOrderRpcInput.pattern)
  adminRemove(
    @Payload() payload: AdminRemoveOrderRpcInput['payload'],
  ): Promise<AdminRemoveOrderRpcInput['response']> {
    return this.ordersService.adminRemove(payload.id);
  }

  @MessagePattern(AdminShipOrderRpcInput.pattern)
  adminShip(
    @Payload() payload: AdminShipOrderRpcInput['payload'],
  ): Promise<AdminShipOrderRpcInput['response']> {
    return this.ordersService.adminShip(payload.id, payload.dto);
  }

  @MessagePattern(AdminDeliverOrderRpcInput.pattern)
  adminDeliver(
    @Payload() payload: AdminDeliverOrderRpcInput['payload'],
  ): Promise<AdminDeliverOrderRpcInput['response']> {
    return this.ordersService.adminDeliver(payload.id);
  }

  @MessagePattern(AdminRefundOrderRpcInput.pattern)
  adminRefund(
    @Payload() payload: AdminRefundOrderRpcInput['payload'],
  ): Promise<AdminRefundOrderRpcInput['response']> {
    return this.ordersService.adminRefund(payload.id);
  }

  //#endregion

  //#region Events

  @EventPattern(OrderPaidEventInput.pattern)
  async eventOrderPaid(
    @Payload() payload: OrderPaidEventInput['payload'],
  ): Promise<void> {
    // TODO: Implement method in the service to process order
    await Promise.resolve(console.log(payload));
  }

  //#endregion
}
