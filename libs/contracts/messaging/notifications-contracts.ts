import { PagCursorResultDto } from '../dto/pagination/pag-cursor-result.dto';
import { NotificationResponseContract } from '../interfaces/notifications/notification-response.interface';
import { RequestUser } from '../interfaces/request-user.interface';
import { CursorParams } from '../types/cursor-params.type';
import { BaseContractMethod } from './base-contract-method';

interface IdentityTransportPayloads {
  FIND_BY_USER_NOTIFICATIONS: { user: RequestUser; cursor: CursorParams };

  MARK_NOTIFICATION_AS_READ: { id: string; userId: string };

  COUNT_UNREAD_NOTIFICATIONS: { userId: string };

  HAS_NEW_NOTIFICATIONS: { userId: string };
}

interface IdentityTransportResponses {
  FIND_BY_USER_NOTIFICATIONS: PagCursorResultDto<NotificationResponseContract>;

  MARK_NOTIFICATION_AS_READ: void;

  COUNT_UNREAD_NOTIFICATIONS: number;

  HAS_NEW_NOTIFICATIONS: boolean;
}

export class IdentityTransportPatterns {
  static FIND_BY_USER_NOTIFICATIONS = 'notifications.findByUser';
  static MARK_NOTIFICATION_AS_READ = 'notifications.markAsRead';
  static COUNT_UNREAD_NOTIFICATIONS = 'notifications.countUnread';
  static HAS_NEW_NOTIFICATIONS = 'notifications.hasNewNotifications';
}

export class FindByUserNotificationsContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.FIND_BY_USER_NOTIFICATIONS;

  public response =
    null as unknown as IdentityTransportResponses['FIND_BY_USER_NOTIFICATIONS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['FIND_BY_USER_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}

export class MarkNotificationAsReadContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.MARK_NOTIFICATION_AS_READ;

  public response =
    null as unknown as IdentityTransportResponses['MARK_NOTIFICATION_AS_READ'];

  constructor(
    public readonly payload: IdentityTransportPayloads['MARK_NOTIFICATION_AS_READ'],
  ) {
    super(payload);
  }
}

export class CountUnreadNotificationsContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.COUNT_UNREAD_NOTIFICATIONS;

  public response =
    null as unknown as IdentityTransportResponses['COUNT_UNREAD_NOTIFICATIONS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['COUNT_UNREAD_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}

export class HasNewNotificationsContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.HAS_NEW_NOTIFICATIONS;

  public response =
    null as unknown as IdentityTransportResponses['HAS_NEW_NOTIFICATIONS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['HAS_NEW_NOTIFICATIONS'],
  ) {
    super(payload);
  }
}
