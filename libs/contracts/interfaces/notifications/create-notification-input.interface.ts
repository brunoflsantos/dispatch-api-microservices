import { NotificationEvent } from '../../../../apps/notifications/src/enums/notification-event.enum';
import { NotificationType } from '../../../../apps/notifications/src/enums/notification-type.enum';

export interface CreateNotificationInput {
  userId: string;

  event: NotificationEvent;

  type: NotificationType;

  data: Record<string, any>;
}
