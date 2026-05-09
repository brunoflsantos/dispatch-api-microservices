import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { LoginResponseContract } from 'libs/contracts/interfaces/auth/login-response.interface';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
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

export interface IIdentityService extends IBaseService {
  publicCreateUser(
    dto: PublicCreateUserRequestContract,
    idempotencyKey: string,
  ): Promise<UserSelfResponseContract>;

  publicFindMyUser(requestUser: RequestUser): Promise<UserSelfResponseContract>;

  publicFindOneUser(id: string): Promise<PublicUserResponseContract>;

  publicFindAllUsers(
    query: PublicUserQueryRequestContract,
  ): Promise<PagOffsetResultDto<PublicUserResponseContract>>;

  publicUpdateUser(
    dto: PublicUpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserSelfResponseContract>;

  publicRemoveMyUser(requestUser: RequestUser): Promise<void>;

  adminCreateUser(
    dto: CreateUserRequestContract,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResponseContract>;

  adminFindAllUsers(
    query: UserQueryRequestContract,
  ): Promise<PagOffsetResultDto<UserResponseContract>>;

  adminFindOneUser(id: string): Promise<UserResponseContract>;

  adminUpdateUser(
    id: string,
    dto: UpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserResponseContract>;

  adminRemoveUser(id: string, requestUser: RequestUser): Promise<void>;

  publicLogin(email: string, password: string): Promise<LoginResponseContract>;

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResponseContract>;

  publicLogout(reqUser: RequestUser): Promise<void>;
}
