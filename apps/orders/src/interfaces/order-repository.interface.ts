import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { OrderOffsetQueryInput } from 'libs/contracts/interfaces/orders/order-offset-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends IBaseRepository<Order> {
  filter(query: Partial<OrderOffsetQueryInput>): Promise<PagOffsetResultDto<Order>>;
}
