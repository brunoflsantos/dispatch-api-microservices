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
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateNotificationInput } from 'libs/contracts/interfaces/notifications/create-notification-input.interface';
import { NotificationCursorQueryInput } from 'libs/contracts/interfaces/notifications/notification-cursor-query-input.interface';
import { NotificationResult } from 'libs/contracts/interfaces/notifications/notification-result.interface';
import { NotificationTranslatedResult } from 'libs/contracts/interfaces/notifications/notification-translated-result.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { I18N_NOTIFICATIONS } from './constants/i18n.constant';
import { NOTIFICATION_REPOSITORY } from './constants/notifications.token';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { Notification } from './entities/notification.entity';
import { NotificationEvent } from './enums/notification-event.enum';
import type { INotificationRepository } from './interfaces/notification-repository.interface';
import { INotificationsService } from './interfaces/notifications-service.interface';
import { NotificationOutputFactory } from './providers/notification-output.factory';

@Injectable()
export class NotificationsService
  extends BaseService
  implements INotificationsService
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationOutputFactory: NotificationOutputFactory,
    private readonly guard: DbGuardService,
  ) {
    super(NotificationsService.name);
  }

  //#region Public

  async create(dto: CreateNotificationInput): Promise<NotificationResult> {
    const notification = this.notificationRepository.createEntity({
      userId: dto.userId,
      type: dto.type,
      event: dto.event,
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

  async findByUser(
    query: NotificationCursorQueryInput,
  ): Promise<PagCursorResultDto<NotificationTranslatedResult>> {
    const result = await this.notificationRepository.filter(query);
    const notificationsTranslated = await this.translate(
      result.items,
      query.language,
    );
    return new PagCursorResultDto<NotificationTranslatedResult>(
      notificationsTranslated,
      result.nextCursor,
      result.hasMore,
    );
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

  //#endregion

  //#region Private

  private async translate(
    notifications: Notification[],
    language: string,
  ): Promise<NotificationTranslatedResult[]> {
    return Promise.all(
      notifications.map(async (notification) => {
        const { title, message } = await this.notificationOutputFactory.create(
          notification.event as NotificationEvent,
          notification.data,
          language,
        );
        return {
          ...notification,
          title,
          message,
        };
      }),
    );
  }

  //#endregion
}
