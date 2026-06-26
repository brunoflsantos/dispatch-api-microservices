import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { NotificationCursorQueryInput } from 'libs/contracts/interfaces/notifications/notification-cursor-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { INotificationRepository } from '../interfaces/notification-repository.interface';

const ALIAS_NOTIFICATION = 'notification';
const notification = col<Notification>(ALIAS_NOTIFICATION);

@Injectable()
export class NotificationRepository
  extends BaseRepository<Notification>
  implements INotificationRepository
{
  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
  ) {
    super(repository);
  }

  async filter(
    query: Partial<NotificationCursorQueryInput>,
  ): Promise<PagCursorResultDto<Notification>> {
    const { userId, cursor } = query;
    const queryBuilder = this.createQueryBuilder(ALIAS_NOTIFICATION)
      .where(`${notification('userId')} = :userId`, { userId })
      .andWhere(`${notification('deletedAt')} IS NULL`)
      .orderBy(`${notification('createdAt')}`, 'DESC')
      .addOrderBy(`${notification('id')}`, 'DESC')
      .take(cursor?.limit ? cursor.limit + 1 : 21);

    if (cursor) {
      queryBuilder.andWhere(`${notification('createdAt')} < :cursorCreatedAt`, {
        cursorCreatedAt: cursor.startingAfter,
      });
    }

    const notifications = await queryBuilder.getMany();
    const limit = cursor?.limit ?? 0;
    const hasNextPage = notifications.length > limit;
    const items = hasNextPage ? notifications.slice(0, limit) : notifications;
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor: hasNextPage && lastItem ? this.encodeCursor(lastItem) : null,
      hasMore: hasNextPage,
    };
  }

  private encodeCursor(notification: Notification): string {
    const cursor: CursorParams = {
      startingAfter: notification.createdAt.toISOString(),
    };

    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }
}
