import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

import { col } from '@/shared/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { OrderOffsetQueryInput } from 'libs/contracts/interfaces/orders/order-offset-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { IOrderRepository } from '../interfaces/order-repository.interface';

const ALIAS_ORDER = 'order';
const ALIAS_ORDER_PRODUCT = 'orderProduct';
const order = col<Order>(ALIAS_ORDER);

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor(
    @InjectRepository(Order) protected readonly repository: Repository<Order>,
  ) {
    super(repository);
  }

  async filter(
    query: Partial<OrderOffsetQueryInput>,
  ): Promise<PagOffsetResultDto<Order>> {
    const { userId, status, startDate, endDate } = query;

    const queryBuilder = this.createQueryBuilder(ALIAS_ORDER).leftJoinAndSelect(
      order('products'),
      ALIAS_ORDER_PRODUCT,
    );

    if (userId) {
      queryBuilder.andWhere(`${order('userId')} = :userId`, {
        userId,
      });
    }
    if (status) {
      queryBuilder.andWhere(`${order('status')} = :status`, {
        status,
      });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere(
        `${order('createdAt')} BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      );
    }

    // Apply pagination
    const limit = query.limit
      ? Math.min(query.limit, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;
    const skip = (query.page - 1) * limit;

    return queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(order('createdAt'), 'DESC')
      .getManyAndCount()
      .then(
        ([data, total]) => new PagOffsetResultDto(total, query.page, limit, data),
      );
  }
}
