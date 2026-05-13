import { OmitType } from '@nestjs/swagger';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OrderProductResult } from 'libs/contracts/interfaces/orders/order-product-result.interface';
import {
  OrderResult,
  PublicOrderResult,
} from 'libs/contracts/interfaces/orders/order-result.interface';

export class OrderResponseDto implements OrderResult {
  id: string;

  userId: string;

  status: OrderStatus;

  total: number;

  products?: OrderProductResult[];

  paymentId: string;

  paymentStatus: string;

  paymentClientSecret?: string;

  trackingNumber?: string;

  carrier?: string;

  shippedAt?: Date;

  deliveredAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export class PublicOrderResponseDto
  extends OmitType(OrderResponseDto, [
    'userId',
    'paymentId',
    'paymentStatus',
  ] as const)
  implements PublicOrderResult {}
