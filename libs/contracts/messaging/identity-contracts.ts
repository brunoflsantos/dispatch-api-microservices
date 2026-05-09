import { PagOffsetResultDto } from '../dto/pagination/pag-offset-result.dto';
import { LoginResponseContract } from '../interfaces/auth/login-response.interface';
import { RequestUser } from '../interfaces/request-user.interface';
import {
  CreateUserRequestContract,
  PublicCreateUserRequestContract,
} from '../interfaces/users/create-user-request.interface';
import { PublicUserQueryRequestContract } from '../interfaces/users/update-user-query-request.interface';
import {
  PublicUpdateUserRequestContract,
  UpdateUserRequestContract,
} from '../interfaces/users/update-user-request.interface';
import {
  PublicUserResponseContract,
  UserResponseContract,
  UserSelfResponseContract,
} from '../interfaces/users/user-response.interface';
import { BaseContractMethod } from './base-contract-method';

interface IdentityTransportPayloads {
  PUBLIC_CREATE_USER: {
    dto: PublicCreateUserRequestContract;
    idempotencyKey: string;
  };

  PUBLIC_FIND_MY_USER: {
    reqUser: RequestUser;
  };

  PUBLIC_FIND_ONE_USER: {
    id: string;
  };

  PUBLIC_FIND_ALL_USERS: {
    query: PublicUserQueryRequestContract;
  };

  PUBLIC_UPDATE_USER: {
    dto: PublicUpdateUserRequestContract;
    reqUser: RequestUser;
  };

  PUBLIC_REMOVE_MY_USER: {
    reqUser: RequestUser;
  };

  ADMIN_FIND_ALL_USERS: {
    query: PublicUserQueryRequestContract;
    reqUser: RequestUser;
  };

  ADMIN_FIND_ONE_USER: {
    id: string;
    reqUser: RequestUser;
  };

  ADMIN_CREATE_USER: {
    dto: CreateUserRequestContract;
    idempotencyKey: string;
    reqUser: RequestUser;
  };

  ADMIN_UPDATE_USER: {
    id: string;
    dto: UpdateUserRequestContract;
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
  PUBLIC_CREATE_USER: UserSelfResponseContract;
  PUBLIC_FIND_MY_USER: UserSelfResponseContract;
  PUBLIC_FIND_ONE_USER: PublicUserResponseContract;
  PUBLIC_FIND_ALL_USERS: PagOffsetResultDto<PublicUserResponseContract>;
  PUBLIC_UPDATE_USER: UserSelfResponseContract;
  PUBLIC_REMOVE_MY_USER: void;

  ADMIN_FIND_ALL_USERS: PagOffsetResultDto<UserResponseContract>;
  ADMIN_FIND_ONE_USER: UserResponseContract;
  ADMIN_CREATE_USER: UserResponseContract;
  ADMIN_UPDATE_USER: UserResponseContract;
  ADMIN_REMOVE_USER: void;

  PUBLIC_LOGIN: LoginResponseContract;
  PUBLIC_REFRESH: LoginResponseContract;
  PUBLIC_LOGOUT: void;
}

export class IdentityTransportPatterns {
  static PUBLIC_CREATE_USER = 'identity.public.users.create';
  static PUBLIC_FIND_MY_USER = 'identity.public.users.findMy';
  static PUBLIC_FIND_ONE_USER = 'identity.public.users.findOne';
  static PUBLIC_FIND_ALL_USERS = 'identity.public.users.findAll';
  static PUBLIC_UPDATE_USER = 'identity.public.users.update';
  static PUBLIC_REMOVE_MY_USER = 'identity.public.users.removeMy';

  static ADMIN_FIND_ALL_USERS = 'identity.admin.users.findAll';
  static ADMIN_FIND_ONE_USER = 'identity.admin.users.findOne';
  static ADMIN_CREATE_USER = 'identity.admin.users.create';
  static ADMIN_UPDATE_USER = 'identity.admin.users.update';
  static ADMIN_REMOVE_USER = 'identity.admin.users.remove';

  static PUBLIC_LOGIN = 'identity.public.users.login';
  static PUBLIC_REFRESH = 'identity.public.users.refresh';
  static PUBLIC_LOGOUT = 'identity.public.users.logout';
}

export class PublicCreateUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_CREATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_CREATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_CREATE_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindMyUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_FIND_MY_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_MY_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_MY_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindOneUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_FIND_ONE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_ONE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_ONE_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindAllUsersContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_FIND_ALL_USERS;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_FIND_ALL_USERS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_FIND_ALL_USERS'],
  ) {
    super(payload);
  }
}

export class PublicUpdateUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_UPDATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_UPDATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_UPDATE_USER'],
  ) {
    super(payload);
  }
}

export class PublicRemoveMyUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_REMOVE_MY_USER;

  public response =
    null as unknown as IdentityTransportResponses['PUBLIC_REMOVE_MY_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['PUBLIC_REMOVE_MY_USER'],
  ) {
    super(payload);
  }
}

export class AdminFindAllUsersContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.ADMIN_FIND_ALL_USERS;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_FIND_ALL_USERS'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_FIND_ALL_USERS'],
  ) {
    super(payload);
  }
}

export class AdminFindOneUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.ADMIN_FIND_ONE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_FIND_ONE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_FIND_ONE_USER'],
  ) {
    super(payload);
  }
}

export class AdminCreateUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.ADMIN_CREATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_CREATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_CREATE_USER'],
  ) {
    super(payload);
  }
}

export class AdminUpdateUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.ADMIN_UPDATE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_UPDATE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_UPDATE_USER'],
  ) {
    super(payload);
  }
}

export class AdminRemoveUserContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.ADMIN_REMOVE_USER;

  public response =
    null as unknown as IdentityTransportResponses['ADMIN_REMOVE_USER'];

  constructor(
    public readonly payload: IdentityTransportPayloads['ADMIN_REMOVE_USER'],
  ) {
    super(payload);
  }
}

export class PublicLoginContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_LOGIN;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_LOGIN'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_LOGIN']) {
    super(payload);
  }
}

export class PublicRefreshContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_REFRESH;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_REFRESH'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_REFRESH']) {
    super(payload);
  }
}

export class PublicLogoutContractMethod extends BaseContractMethod {
  public static message = IdentityTransportPatterns.PUBLIC_LOGOUT;

  public response = null as unknown as IdentityTransportResponses['PUBLIC_LOGOUT'];

  constructor(public readonly payload: IdentityTransportPayloads['PUBLIC_LOGOUT']) {
    super(payload);
  }
}
