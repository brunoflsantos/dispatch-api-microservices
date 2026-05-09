import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OrderProductResponseContract } from './order-product-response.interface';

export interface OrderResponseContract {
  id: string;

  userId: string;

  status: OrderStatus;

  total: number;

  products?: OrderProductResponseContract[];

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
