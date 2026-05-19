import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { NotificationCursorQueryInput } from 'libs/contracts/interfaces/notifications/notification-cursor-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Notification } from '../entities/notification.entity';

export interface INotificationRepository extends IBaseRepository<Notification> {
  filter(
    query: NotificationCursorQueryInput,
  ): Promise<PagCursorResultDto<Notification>>;
}
