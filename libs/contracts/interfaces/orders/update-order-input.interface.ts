import { OrderStatus } from 'libs/common/enums/order-status.enum';

export interface UpdateOrderInput {
  status: OrderStatus;
}
