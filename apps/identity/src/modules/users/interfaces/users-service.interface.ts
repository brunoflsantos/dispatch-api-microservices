import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
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
  PublicUserQueryInput,
  UserQueryRequestInput,
} from 'libs/contracts/interfaces/users/update-user-query-input.interface';
import {
  PublicUserResult,
  UserResult,
  UserSelfResult,
} from 'libs/contracts/interfaces/users/user-result.interface';

export interface IUsersService extends IBaseService {
  publicCreate(
    dto: PublicCreateUserInput,
    idempotencyKey: string,
  ): Promise<UserSelfResult>;

  publicFindMe(requestUser: RequestUser): Promise<UserSelfResult>;

  publicFindOne(id: string): Promise<PublicUserResult>;

  publicFindAll(
    query: PublicUserQueryInput,
  ): Promise<PagOffsetResultDto<PublicUserResult>>;

  publicUpdate(
    dto: PublicUpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserSelfResult>;

  publicRemoveMe(requestUser: RequestUser): Promise<void>;

  adminCreate(
    dto: CreateUserInput,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResult>;

  adminFindAll(
    query: UserQueryRequestInput,
  ): Promise<PagOffsetResultDto<UserResult>>;

  adminFindOne(id: string): Promise<UserResult>;

  adminUpdate(
    id: string,
    dto: UpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult>;

  adminRemove(id: string, requestUser: RequestUser): Promise<void>;
}
