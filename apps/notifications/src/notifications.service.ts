import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LOCK_KEYS } from 'libs/common/modules/cache/constants/lock-keys.constant';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { template } from 'libs/common/utils/functions.utils';
import { CursorParams } from 'libs/contracts/dto/cursor-query.dto';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateNotificationInput } from 'libs/contracts/interfaces/notifications/create-notification-input.interface';
import { NotificationResult } from 'libs/contracts/interfaces/notifications/notification-result.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { I18N_NOTIFICATIONS } from './constants/i18n.constant';
import { NOTIFICATION_REPOSITORY } from './constants/notifications.token';
import { NotificationResponseDto } from './dto/notification-response.dto';
import type { INotificationRepository } from './interfaces/notification-repository.interface';
import { INotificationsService } from './interfaces/notifications-service.interface';

@Injectable()
export class NotificationsService
  extends BaseService
  implements INotificationsService
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    private readonly guard: DbGuardService,
  ) {
    super(NotificationsService.name);
  }

  async create(dto: CreateNotificationInput): Promise<NotificationResult> {
    const notification = this.notificationRepository.createEntity({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data,
    });
    const saved = await this.notificationRepository.save(notification);

    return EntityMapper.map(saved, NotificationResponseDto);
  }

  markAsRead(id: string, userId: string): Promise<void> {
    return this.guard.lock(LOCK_KEYS.NOTIFICATIONS.UPDATE(id), async () =>
      this._markAsRead(id, userId),
    );
  }

  private async _markAsRead(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new BadRequestException(
        template(I18N_NOTIFICATIONS.ERRORS.NOTIFICATION_NOT_FOUND),
      );
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        template(I18N_NOTIFICATIONS.ERRORS.ACCESS_DENIED),
      );
    }
    if (notification.read) {
      return;
    }

    notification.read = true;
    notification.readAt = new Date();

    await this.notificationRepository.save(notification);
  }

  findByUser(
    userId: string,
    cursor?: CursorParams,
  ): Promise<PagCursorResultDto<NotificationResult>> {
    return this.notificationRepository.filterByUser(userId, cursor);
  }

  hasNewNotifications(userId: string): Promise<boolean> {
    return this.notificationRepository.existsBy({
      where: { userId, read: false },
    });
  }

  countUnread(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, read: false },
    });
  }
}
