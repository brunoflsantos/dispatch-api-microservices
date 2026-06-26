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
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { IBaseService } from 'libs/contracts/services/base-service.interface';

export interface IOrdersService extends IBaseService {
  publicCreate(
    dto: CreateOrderInput,
    reqUser: RequestUser,
    idempotencyKey: string,
  ): Promise<PublicOrderResult>;

  publicFindByUser(
    query: OrderByUserCursorQueryInput,
    reqUser: RequestUser,
  ): Promise<PagCursorResultDto<PublicOrderResult>>;

  publicFindOne(id: string, reqUser: RequestUser): Promise<PublicOrderResult>;

  adminFindAll(
    query: OrderCursorQueryInput,
  ): Promise<PagCursorResultDto<OrderResult>>;

  adminFindOne(id: string): Promise<OrderResult>;

  publicCancel(id: string): Promise<void>;

  adminUpdate(id: string, dto: UpdateOrderInput): Promise<OrderResult>;

  adminRemove(id: string): Promise<void>;

  adminShip(id: string, dto: ShipOrderInput): Promise<OrderResult>;

  adminDeliver(id: string): Promise<OrderResult>;

  adminRefund(id: string): Promise<void>;

  markPaymentAsSucceeded(dto: UpdateOrderPaymentInput): Promise<OrderResult>;

  markPaymentAsFailed(dto: UpdateOrderPaymentInput): Promise<OrderResult>;
}
