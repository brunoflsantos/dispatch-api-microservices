import {
  UserCreatedEventType,
  UserDeletedEventType,
  UserUpdatedEventType,
} from '../types/identity.type';
import { BaseEventInput } from './base.input';

interface IdentityTransportPayloads {
  USER_CREATED: UserCreatedEventType;

  USER_UPDATED: UserUpdatedEventType;

  USER_DELETED: UserDeletedEventType;
}

class IdentityTransportPatterns {
  static readonly USER_CREATED = 'identity.user-created';
  static readonly USER_UPDATED = 'identity.user-updated';
  static readonly USER_DELETED = 'identity.user-deleted';
}

abstract class BaseIdentityEventInput extends BaseEventInput {}

export class UserCreatedEventInput extends BaseIdentityEventInput {
  public static pattern = IdentityTransportPatterns.USER_CREATED;

  constructor(public readonly payload: IdentityTransportPayloads['USER_CREATED']) {
    super(payload);
  }
}

export class UserUpdatedEventInput extends BaseIdentityEventInput {
  public static pattern = IdentityTransportPatterns.USER_UPDATED;

  constructor(public readonly payload: IdentityTransportPayloads['USER_UPDATED']) {
    super(payload);
  }
}

export class UserDeletedEventInput extends BaseIdentityEventInput {
  public static pattern = IdentityTransportPatterns.USER_DELETED;

  constructor(public readonly payload: IdentityTransportPayloads['USER_DELETED']) {
    super(payload);
  }
}
