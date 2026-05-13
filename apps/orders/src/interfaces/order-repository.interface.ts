import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { OrderQueryInput } from 'libs/contracts/interfaces/orders/order-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends IBaseRepository<Order> {
  filter(query: Partial<OrderQueryInput>): Promise<PagOffsetResultDto<Order>>;
}
