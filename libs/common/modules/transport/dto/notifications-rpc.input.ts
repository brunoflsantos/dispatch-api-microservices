import { NotificationCursorQueryInput } from 'libs/contracts/interfaces/notifications/notification-cursor-query-input.interface';
import { NotificationTranslatedResult } from 'libs/contracts/interfaces/notifications/notification-translated-result.interface';
import { PagCursorResultDto } from '../../../../contracts/dto/pagination/pag-cursor-result.dto';
import { BaseRpcInput } from './base.input';

interface NotificationsTransportPayloads {
  FIND_BY_USER_NOTIFICATIONS: { query: NotificationCursorQueryInput };

  MARK_NOTIFICATION_AS_READ: { id: string; userId: string };

  COUNT_UNREAD_NOTIFICATIONS: { userId: string };

  HAS_NEW_NOTIFICATIONS: { userId: string };
}

interface NotificationsTransportResponses {
  FIND_BY_USER_NOTIFICATIONS: PagCursorResultDto<NotificationTranslatedResult>;

  MARK_NOTIFICATION_AS_READ: void;

  COUNT_UNREAD_NOTIFICATIONS: number;

  HAS_NEW_NOTIFICATIONS: boolean;
}

export class NotificationsTransportPatterns {
  static readonly FIND_BY_USER_NOTIFICATIONS = 'notifications.find-by-user';
  static readonly MARK_NOTIFICATION_AS_READ = 'notifications.mark-as-read';
  static readonly COUNT_UNREAD_NOTIFICATIONS = 'notifications.count-unread';
  static readonly HAS_NEW_NOTIFICATIONS = 'notifications.has-new-notifications';
}

export abstract class BaseNotificationsRpcInput extends BaseRpcInput {}

export class FindByUserNotificationsRpcInput extends BaseNotificationsRpcInput {
  public static pattern = NotificationsTransportPatterns.FIND_BY_USER_NOTIFICATIONS;

  public response =
    null as unknown as NotificationsTransportResponses['FIND_BY_USER_NOTIFICATIONS'];

  constructor(
    public readonly payload: NotificationsTransportPayloads['FIND_BY_USER_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}

export class MarkNotificationAsReadRpcInput extends BaseNotificationsRpcInput {
  public static pattern = NotificationsTransportPatterns.MARK_NOTIFICATION_AS_READ;

  public response =
    null as unknown as NotificationsTransportResponses['MARK_NOTIFICATION_AS_READ'];

  constructor(
    public readonly payload: NotificationsTransportPayloads['MARK_NOTIFICATION_AS_READ'],
  ) {
    super(payload);
  }
}

export class CountUnreadNotificationsRpcInput extends BaseNotificationsRpcInput {
  public static pattern = NotificationsTransportPatterns.COUNT_UNREAD_NOTIFICATIONS;

  public response =
    null as unknown as NotificationsTransportResponses['COUNT_UNREAD_NOTIFICATIONS'];

  constructor(
    public readonly payload: NotificationsTransportPayloads['COUNT_UNREAD_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}

export class HasNewNotificationsRpcInput extends BaseNotificationsRpcInput {
  public static pattern = NotificationsTransportPatterns.HAS_NEW_NOTIFICATIONS;

  public response =
    null as unknown as NotificationsTransportResponses['HAS_NEW_NOTIFICATIONS'];

  constructor(
    public readonly payload: NotificationsTransportPayloads['HAS_NEW_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}
