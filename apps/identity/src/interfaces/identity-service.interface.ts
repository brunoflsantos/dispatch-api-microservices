import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { LoginResult } from 'libs/contracts/interfaces/auth/login-result.interface';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
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
  PublicUserOffsetQueryInput,
  UserOffsetQueryInput,
} from 'libs/contracts/interfaces/users/user-offset-query-input.interface';
import {
  PublicUserResult,
  UserResult,
  UserSelfResult,
} from 'libs/contracts/interfaces/users/user-result.interface';

export interface IIdentityService extends IBaseService {
  publicCreateUser(
    dto: PublicCreateUserInput,
    idempotencyKey: string,
  ): Promise<UserSelfResult>;

  publicFindMyUser(requestUser: RequestUser): Promise<UserSelfResult>;

  publicFindOneUser(id: string): Promise<PublicUserResult>;

  publicFindAllUsers(
    query: PublicUserOffsetQueryInput,
  ): Promise<PagOffsetResultDto<PublicUserResult>>;

  publicUpdateUser(
    dto: PublicUpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserSelfResult>;

  publicRemoveMyUser(requestUser: RequestUser): Promise<void>;

  adminCreateUser(
    dto: CreateUserInput,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResult>;

  adminFindAllUsers(
    query: UserOffsetQueryInput,
  ): Promise<PagOffsetResultDto<UserResult>>;

  adminFindOneUser(id: string): Promise<UserResult>;

  adminUpdateUser(
    id: string,
    dto: UpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult>;

  adminRemoveUser(id: string, requestUser: RequestUser): Promise<void>;

  publicLogin(email: string, password: string): Promise<LoginResult>;

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResult>;

  publicLogout(reqUser: RequestUser): Promise<void>;
}
