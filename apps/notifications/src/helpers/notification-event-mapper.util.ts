import { I18N_NOTIFICATIONS } from '../constants/i18n.constant';
import { NotificationEvent } from '../enums/notification-event.enum';

const NOTIFICATION_EVENT_TITLE_MAPPER: Record<string, string> = {
  [NotificationEvent.ORDER_CREATED]:
    I18N_NOTIFICATIONS.NOTIFICATION_TITLES.ORDER_CREATED,
  [NotificationEvent.ORDER_FAILED_UPON_CREATING]:
    I18N_NOTIFICATIONS.NOTIFICATION_TITLES.ORDER_FAILED_UPON_CREATING,
};

const NOTIFICATION_EVENT_MESSAGE_MAPPER: Record<string, string> = {
  [NotificationEvent.ORDER_CREATED]:
    I18N_NOTIFICATIONS.NOTIFICATION_MESSAGES.ORDER_CREATED,
  [NotificationEvent.ORDER_FAILED_UPON_CREATING]:
    I18N_NOTIFICATIONS.NOTIFICATION_MESSAGES.ORDER_FAILED_UPON_CREATING,
};

export class NotificationEventToTemplateMapper {
  /**
   * Get the title template for a given notification event.
   * @param event The notification event type.
   * @returns The title template string for the event.
   */
  static getTitleTemplate(event: NotificationEvent): string {
    return NOTIFICATION_EVENT_TITLE_MAPPER[event];
  }

  /**
   * Get the message template for a given notification event.
   * @param event The notification event type.
   * @returns The message template string for the event.
   */
  static getMessageTemplate(event: NotificationEvent): string {
    return NOTIFICATION_EVENT_MESSAGE_MAPPER[event];
  }
}
