import { PagOffsetResultDto } from '../../../../contracts/dto/pagination/pag-offset-result.dto';
import { LoginResult } from '../../../../contracts/interfaces/auth/login-result.interface';
import { RequestUser } from '../../../../contracts/interfaces/request-user.interface';
import {
  CreateUserInput,
  PublicCreateUserInput,
} from '../../../../contracts/interfaces/users/create-user-input.interface';
import {
  PublicUpdateUserInput,
  UpdateUserInput,
} from '../../../../contracts/interfaces/users/update-user-input.interface';
import { PublicUserQueryInput } from '../../../../contracts/interfaces/users/update-user-query-input.interface';
import {
  PublicUserResult,
  UserResult,
  UserSelfResult,
} from '../../../../contracts/interfaces/users/user-result.interface';
import { BaseRpcInput } from './base.input';

interface IdentityTransportPayloads {
  PUBLIC_CREATE_USER: {
    dto: PublicCreateUserInput;
    idempotencyKey: string;
  };

  PUBLIC_FIND_MY_USER: {
    reqUser: RequestUser;
  };

  PUBLIC_FIND_ONE_USER: {
    id: string;
  };

  PUBLIC_FIND_ALL_USERS: {
    query: PublicUserQueryInput;
  };

  PUBLIC_UPDATE_USER: {
    dto: PublicUpdateUserInput;
    reqUser: RequestUser;
  };

  PUBLIC_REMOVE_MY_USER: {
    reqUser: RequestUser;
  };

  ADMIN_FIND_ALL_USERS: {
    query: PublicUserQueryInput;
    reqUser: RequestUser;
  };

  ADMIN_FIND_ONE_USER: {
    id: string;
    reqUser: RequestUser;
  };

  ADMIN_CREATE_USER: {
    dto: CreateUserInput;
    idempotencyKey: string;
    reqUser: RequestUser;
  };

  ADMIN_UPDATE_USER: {
    id: string;
    dto: UpdateUserInput;
    reqUser: RequestUser;
  };

  ADMIN_REMOVE_USER: {
    id: string;
    reqUser: RequestUser;
  };

  PUBLIC_LOGIN: {
    email: string;
    password: string;
  };

  PUBLIC_REFRESH: {
    reqUser: RequestUser;
  };

  PUBLIC_LOGOUT: {
    reqUser: RequestUser;
  };
}

interface IdentityTransportResponses {
  PUBLIC_CREATE_USER: UserSelfResult;
  PUBLIC_FIND_MY_USER: UserSelfResult;
  PUBLIC_FIND_ONE_USER: PublicUserResult;
  PUBLIC_FIND_ALL_USERS: PagOffsetResultDto<PublicUserResult>;
  PUBLIC_UPDATE_USER: UserSelfResult;
  PUBLIC_REMOVE_MY_USER: void;

  ADMIN_FIND_ALL_USERS: PagOffsetResultDto<UserResult>;
  ADMIN_FIND_ONE_USER: UserResult;
  ADMIN_CREATE_USER: UserResult;
  ADMIN_UPDATE_USER: UserResult;
  ADMIN_REMOVE_USER: void;

  PUBLIC_LOGIN: LoginResult;
  PUBLIC_REFRESH: LoginResult;
  PUBLIC_LOGOUT: void;
}

export class IdentityTransportPatterns {
  static readonly PUBLIC_CREATE_USER = 'identity.public-create-user';
  static readonly PUBLIC_FIND_MY_USER = 'identity.public-find-my-user';
  static readonly PUBLIC_FIND_ONE_USER = 'identity.public-find-one-user';
  static readonly PUBLIC_FIND_ALL_USERS = 'identity.public-find-all-users';
  static readonly PUBLIC_UPDATE_USER = 'identity.public-update-user';
  static readonly PUBLIC_REMOVE_MY_USER = 'identity.public-remove-my-user';

  static readonly ADMIN_FIND_ALL_USERS = 'identity.admin-find-all-users';
  static readonly ADMIN_FIND_ONE_USER = 'identity.admin-find-one-user';
  static readonly ADMIN_CREATE_USER = 'identity.admin-create-user';
  static readonly ADMIN_UPDATE_USER = 'identity.admin-update-user';
  static readonly ADMIN_REMOVE_USER = 'identity.admin-remove-user';

  static readonly PUBLIC_LOGIN = 'identity.public-login';
  static readonly PUBLIC_REFRESH = 'identity.public-refresh';
  static readonly PUBLIC_LOGOUT = 'identity.public-logout';
}

export abstract class BaseIdentityRpcInput extends BaseRpcInput {}

export class PublicCreateUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_CREATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_CREATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_CREATE_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindMyUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_FIND_MY_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_MY_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_MY_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindOneUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_FIND_ONE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_ONE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_ONE_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindAllUsersRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_FIND_ALL_USERS;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_ALL_USERS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_ALL_USERS'],
  ) {
    super(payload);
  }
}

export class PublicUpdateUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_UPDATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_UPDATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_UPDATE_USER'],
  ) {
    super(payload);
  }
}

export class PublicRemoveMyUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_REMOVE_MY_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_REMOVE_MY_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_REMOVE_MY_USER'],
  ) {
    super(payload);
  }
}

export class AdminFindAllUsersRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.ADMIN_FIND_ALL_USERS;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_FIND_ALL_USERS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_FIND_ALL_USERS'],
  ) {
    super(payload);
  }
}

export class AdminFindOneUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.ADMIN_FIND_ONE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_FIND_ONE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_FIND_ONE_USER'],
  ) {
    super(payload);
  }
}

export class AdminCreateUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.ADMIN_CREATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_CREATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_CREATE_USER'],
  ) {
    super(payload);
  }
}

export class AdminUpdateUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.ADMIN_UPDATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_UPDATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_UPDATE_USER'],
  ) {
    super(payload);
  }
}

export class AdminRemoveUserRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.ADMIN_REMOVE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_REMOVE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_REMOVE_USER'],
  ) {
    super(payload);
  }
}

export class PublicLoginRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_LOGIN;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_LOGIN'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_LOGIN']) {
    super(payload);
  }
}

export class PublicRefreshRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_REFRESH;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_REFRESH'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_REFRESH']) {
    super(payload);
  }
}

export class PublicLogoutRpcInput extends BaseIdentityRpcInput {
  public static pattern = IdentityTransportPatterns.PUBLIC_LOGOUT;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_LOGOUT'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_LOGOUT']) {
    super(payload);
  }
}
