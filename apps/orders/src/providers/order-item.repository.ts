import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { OrderProduct } from '../entities/order-product.entity';
import { IOrderProductRepository } from '../interfaces/order-product-repository.interface';

@Injectable()
export class OrderProductRepository
  extends BaseRepository<OrderProduct>
  implements IOrderProductRepository
{
  constructor(
    @InjectRepository(OrderProduct)
    protected readonly repository: Repository<OrderProduct>,
  ) {
    super(repository);
  }
}
