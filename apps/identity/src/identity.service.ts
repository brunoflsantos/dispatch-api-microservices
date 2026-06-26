import { Inject, Injectable } from '@nestjs/common';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { LoginResult } from 'libs/contracts/interfaces/auth/login-result.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import {
  CreateUserInput,
  PublicCreateUserInput,
} from 'libs/contracts/interfaces/users/create-user-input.interface';
import {
  PublicUpdateUserInput,
  UpdateUserInput,
} from 'libs/contracts/interfaces/users/update-user-input.interface';
import {
  PublicUserCursorQueryInput,
  UserCursorQueryInput,
} from 'libs/contracts/interfaces/users/user-cursor-query-input.interface';
import {
  PublicUserResult,
  UserResult,
  UserSelfResult,
} from 'libs/contracts/interfaces/users/user-result.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { AUTH_SERVICE, USERS_SERVICE } from './constants/identity.token';
import { IIdentityService } from './interfaces/identity-service.interface';
import type { IAuthService } from './modules/auth/interfaces/auth-service.interface';
import type { IUsersService } from './modules/users/interfaces/users-service.interface';

@Injectable()
export class IdentityService extends BaseService implements IIdentityService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {
    super(IdentityService.name);
  }

  //#region Users - Public

  publicCreateUser(
    dto: PublicCreateUserInput,
    idempotencyKey: string,
  ): Promise<UserSelfResult> {
    return this.usersService.publicCreate(dto, idempotencyKey);
  }

  publicFindMyUser(requestUser: RequestUser): Promise<UserSelfResult> {
    return this.usersService.publicFindMe(requestUser);
  }

  publicFindOneUser(id: string): Promise<PublicUserResult> {
    return this.usersService.publicFindOne(id);
  }

  publicFindAllUsers(
    query: PublicUserCursorQueryInput,
  ): Promise<PagCursorResultDto<PublicUserResult>> {
    return this.usersService.publicFindAll(query);
  }

  publicUpdateUser(
    dto: PublicUpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserSelfResult> {
    return this.usersService.publicUpdate(dto, requestUser);
  }

  publicRemoveMyUser(requestUser: RequestUser): Promise<void> {
    return this.usersService.publicRemoveMe(requestUser);
  }

  //#endregion

  //#region Users - Admin

  adminCreateUser(
    dto: CreateUserInput,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    return this.usersService.adminCreate(dto, idempotencyKey, requestUser);
  }

  adminFindAllUsers(
    query: UserCursorQueryInput,
  ): Promise<PagCursorResultDto<UserResult>> {
    return this.usersService.adminFindAll(query);
  }

  adminFindOneUser(id: string): Promise<UserResult> {
    return this.usersService.adminFindOne(id);
  }

  adminUpdateUser(
    id: string,
    dto: UpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    return this.usersService.adminUpdate(id, dto, requestUser);
  }

  adminRemoveUser(id: string, requestUser: RequestUser): Promise<void> {
    return this.usersService.adminRemove(id, requestUser);
  }

  //#endregion

  //#region Auth - Public

  publicLogin(email: string, password: string): Promise<LoginResult> {
    return this.authService.publicLogin(email, password);
  }

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResult> {
    return this.authService.publicRefreshSession(reqUser);
  }

  publicLogout(reqUser: RequestUser): Promise<void> {
    return this.authService.publicLogout(reqUser);
  }

  //#endregion
}
