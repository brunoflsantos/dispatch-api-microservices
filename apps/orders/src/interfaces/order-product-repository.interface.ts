import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { OrderProduct } from '../entities/order-product.entity';

export interface IOrderProductRepository extends IBaseRepository<OrderProduct> {}
