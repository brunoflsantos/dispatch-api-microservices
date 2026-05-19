import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { CursorQueryDto } from 'libs/contracts/dto/cursor-query.dto';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { IPaymentRepository } from '../interfaces/payment-repository.interface';

const ALIAS_PAYMENT = 'payment';
const payment = col<Payment>(ALIAS_PAYMENT);

@Injectable()
export class PaymentRepository
  extends BaseRepository<Payment>
  implements IPaymentRepository
{
  constructor(@InjectRepository(Payment) repository: Repository<Payment>) {
    super(repository);
  }

  async filter(
    query: PaymentCursorQueryInput,
  ): Promise<PagCursorResultDto<Payment>> {
    const { userId, orderId, cursor } = query;
    const queryBuilder = this.createQueryBuilder(ALIAS_PAYMENT)
      .where(`${payment('deletedAt')} IS NULL`)
      .orderBy(`${payment('createdAt')}`, 'DESC')
      .addOrderBy(`${payment('id')}`, 'DESC')
      .take(cursor?.limit ? cursor.limit + 1 : 21);

    if (userId) {
      queryBuilder.andWhere(`${payment('userId')} = :userId`, {
        userId,
      });
    }

    if (orderId) {
      queryBuilder.andWhere(`${payment('orderId')} = :orderId`, {
        orderId,
      });
    }

    if (cursor) {
      queryBuilder.andWhere(`${payment('createdAt')} < :cursorCreatedAt`, {
        cursorCreatedAt: cursor.startingAfter,
      });
    }

    const payments = await queryBuilder.getMany();
    const hasNextPage = payments.length > (cursor?.limit || 20);
    const items = hasNextPage ? payments.slice(0, -1) : payments;
    const lastItem = items[items.length - 1];

    return {
      items,
      nextCursor: hasNextPage && lastItem ? this.encodeCursor(lastItem) : null,
      hasMore: hasNextPage,
    };
  }

  private encodeCursor(payment: Payment): string {
    const cursor: CursorQueryDto = {
      startingAfter: payment.createdAt.toISOString(),
    };

    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }
}
