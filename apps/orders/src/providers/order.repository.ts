import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

import { col } from '@/shared/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { OrderCursorQueryInput } from 'libs/contracts/interfaces/orders/order-cursor-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
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
    query: Partial<OrderCursorQueryInput>,
  ): Promise<PagCursorResultDto<Order>> {
    const { userId, status, startDate, endDate, cursor } = query;
    const limit = cursor?.limit ? Math.min(cursor.limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;

    const queryBuilder = this.createQueryBuilder(ALIAS_ORDER)
      .leftJoinAndSelect(order('products'), ALIAS_ORDER_PRODUCT)
      .orderBy(order('createdAt'), 'DESC')
      .addOrderBy(order('id'), 'DESC')
      .take(limit + 1);

    if (userId) {
      queryBuilder.andWhere(`${order('userId')} = :userId`, { userId });
    }
    if (status) {
      queryBuilder.andWhere(`${order('status')} = :status`, { status });
    }
    if (startDate && endDate) {
      queryBuilder.andWhere(
        `${order('createdAt')} BETWEEN :startDate AND :endDate`,
        { startDate, endDate },
      );
    }
    if (cursor?.startingAfter) {
      queryBuilder.andWhere(`${order('createdAt')} < :startingAfter`, {
        startingAfter: cursor.startingAfter,
      });
    }

    const items = await queryBuilder.getMany();
    const hasMore = items.length > limit;
    const paginatedItems = hasMore ? items.slice(0, limit) : items;
    const lastItem = paginatedItems.at(-1);

    return new PagCursorResultDto(
      paginatedItems,
      hasMore && lastItem ? this.encodeCursor(lastItem) : undefined,
      hasMore,
    );
  }

  private encodeCursor(item: Order): string {
    const cursor: CursorParams = { startingAfter: item.createdAt.toISOString() };
    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }
}
