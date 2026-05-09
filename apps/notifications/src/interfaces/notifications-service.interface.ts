import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateNotificationRequestContract } from 'libs/contracts/interfaces/notifications/create-notification-request.interface';
import { NotificationResponseContract } from 'libs/contracts/interfaces/notifications/notification-response.interface';
import { IBaseService } from 'libs/contracts/services/base-service.interface';
import { CursorParams } from 'libs/contracts/types/cursor-params.type';

export interface INotificationsService extends IBaseService {
  create(
    dto: CreateNotificationRequestContract,
  ): Promise<NotificationResponseContract>;

  markAsRead(id: string, userId: string): Promise<void>;

  findByUser(
    userId: string,
    cursor?: CursorParams,
  ): Promise<PagCursorResultDto<NotificationResponseContract>>;

  hasNewNotifications(userId: string): Promise<boolean>;

  countUnread(userId: string): Promise<number>;
}
