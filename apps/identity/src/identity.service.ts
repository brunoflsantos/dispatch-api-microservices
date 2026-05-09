import { Inject, Injectable } from '@nestjs/common';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import type { IAuthService } from 'libs/contracts/interfaces/auth-service.interface';
import { LoginResponseContract } from 'libs/contracts/interfaces/auth/login-response.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import {
  CreateUserRequestContract,
  PublicCreateUserRequestContract,
} from 'libs/contracts/interfaces/users/create-user-request.interface';
import {
  PublicUserQueryRequestContract,
  UserQueryRequestContract,
} from 'libs/contracts/interfaces/users/update-user-query-request.interface';
import {
  PublicUpdateUserRequestContract,
  UpdateUserRequestContract,
} from 'libs/contracts/interfaces/users/update-user-request.interface';
import {
  PublicUserResponseContract,
  UserResponseContract,
  UserSelfResponseContract,
} from 'libs/contracts/interfaces/users/user-response.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { AUTH_SERVICE, USERS_SERVICE } from './constants/identity.token';
import { IIdentityService } from './interfaces/identity-service.interface';
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
    dto: PublicCreateUserRequestContract,
    idempotencyKey: string,
  ): Promise<UserSelfResponseContract> {
    return this.usersService.publicCreate(dto, idempotencyKey);
  }

  publicFindMyUser(requestUser: RequestUser): Promise<UserSelfResponseContract> {
    return this.usersService.publicFindMe(requestUser);
  }

  publicFindOneUser(id: string): Promise<PublicUserResponseContract> {
    return this.usersService.publicFindOne(id);
  }

  publicFindAllUsers(
    query: PublicUserQueryRequestContract,
  ): Promise<PagOffsetResultDto<PublicUserResponseContract>> {
    return this.usersService.publicFindAll(query);
  }

  publicUpdateUser(
    dto: PublicUpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserSelfResponseContract> {
    return this.usersService.publicUpdate(dto, requestUser);
  }

  publicRemoveMyUser(requestUser: RequestUser): Promise<void> {
    return this.usersService.publicRemoveMe(requestUser);
  }

  //#endregion

  //#region Users - Admin

  adminCreateUser(
    dto: CreateUserRequestContract,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResponseContract> {
    return this.usersService.adminCreate(dto, idempotencyKey, requestUser);
  }

  adminFindAllUsers(
    query: UserQueryRequestContract,
  ): Promise<PagOffsetResultDto<UserResponseContract>> {
    return this.usersService.adminFindAll(query);
  }

  adminFindOneUser(id: string): Promise<UserResponseContract> {
    return this.usersService.adminFindOne(id);
  }

  adminUpdateUser(
    id: string,
    dto: UpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserResponseContract> {
    return this.usersService.adminUpdate(id, dto, requestUser);
  }

  adminRemoveUser(id: string, requestUser: RequestUser): Promise<void> {
    return this.usersService.adminRemove(id, requestUser);
  }

  //#endregion

  //#region Auth - Public

  publicLogin(email: string, password: string): Promise<LoginResponseContract> {
    return this.authService.login(email, password);
  }

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResponseContract> {
    return this.authService.refresh(reqUser);
  }

  publicLogout(reqUser: RequestUser): Promise<void> {
    return this.authService.logout(reqUser);
  }

  //#endregion
}
