import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { Brackets, Repository } from 'typeorm';
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

  async filterByUser(
    userId: string,
    cursor?: CursorParams,
    limit = 20,
  ): Promise<PagCursorResultDto<Notification>> {
    const queryBuilder = this.createQueryBuilder(ALIAS_NOTIFICATION)
      .where(`${notification('userId')} = :userId`, { userId })
      .andWhere(`${notification('deactivatedAt')} IS NULL`)
      .orderBy(`${notification('createdAt')}`, 'DESC')
      .addOrderBy(`${notification('id')}`, 'DESC')
      .take(limit + 1);

    if (cursor) {
      queryBuilder.andWhere(
        new Brackets((cursorQuery) => {
          cursorQuery.where(`${notification('createdAt')} < :cursorCreatedAt`, {
            cursorCreatedAt: cursor.createdAt,
          });
          cursorQuery.orWhere(
            `(${notification('createdAt')} = :cursorCreatedAt AND ${notification('id')} < :cursorId)`,
            {
              cursorCreatedAt: cursor.createdAt,
              cursorId: cursor.id,
            },
          );
        }),
      );
    }

    const notifications = await queryBuilder.getMany();
    const hasNextPage = notifications.length > limit;
    const items = hasNextPage ? notifications.slice(0, limit) : notifications;
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor: hasNextPage && lastItem ? this.encodeCursor(lastItem) : null,
    };
  }

  private encodeCursor(notification: Notification): string {
    const cursor: CursorParams = {
      createdAt: notification.createdAt.toISOString(),
      id: notification.id,
    };

    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }
}
