import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OrderProductResult } from './order-product-result.interface';

export interface OrderResult {
  id: string;

  userId: string;

  status: OrderStatus;

  total: number;

  products?: OrderProductResult[];

  paymentId: string;

  paymentStatus: string;

  paymentClientSecret?: string | null;

  trackingNumber?: string;

  carrier?: string;

  shippedAt?: Date;

  deliveredAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface PublicOrderResult extends Omit<
  OrderResult,
  'userId' | 'paymentId' | 'paymentStatus'
> {}
