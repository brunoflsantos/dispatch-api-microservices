import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateNotificationInput } from 'libs/contracts/interfaces/notifications/create-notification-input.interface';
import { NotificationCursorQueryInput } from 'libs/contracts/interfaces/notifications/notification-cursor-query-input.interface';
import { NotificationResult } from 'libs/contracts/interfaces/notifications/notification-result.interface';
import { NotificationTranslatedResult } from 'libs/contracts/interfaces/notifications/notification-translated-result.interface';
import { IBaseService } from 'libs/contracts/services/base-service.interface';

export interface INotificationsService extends IBaseService {
  create(dto: CreateNotificationInput): Promise<NotificationResult>;

  markAsRead(id: string, userId: string): Promise<void>;

  findByUser(
    query: NotificationCursorQueryInput,
  ): Promise<PagCursorResultDto<NotificationTranslatedResult>>;

  hasNewNotifications(userId: string): Promise<boolean>;

  countUnread(userId: string): Promise<number>;
}
