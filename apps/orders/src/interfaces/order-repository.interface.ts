import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { OrderCursorQueryInput } from 'libs/contracts/interfaces/orders/order-cursor-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends IBaseRepository<Order> {
  filter(query: Partial<OrderCursorQueryInput>): Promise<PagCursorResultDto<Order>>;
}
