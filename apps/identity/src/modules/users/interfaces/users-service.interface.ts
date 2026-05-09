import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
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

export interface IUsersService extends IBaseService {
  publicCreate(
    dto: PublicCreateUserRequestContract,
    idempotencyKey: string,
  ): Promise<UserSelfResponseContract>;

  publicFindMe(requestUser: RequestUser): Promise<UserSelfResponseContract>;

  publicFindOne(id: string): Promise<PublicUserResponseContract>;

  publicFindAll(
    query: PublicUserQueryRequestContract,
  ): Promise<PagOffsetResultDto<PublicUserResponseContract>>;

  publicUpdate(
    dto: PublicUpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserSelfResponseContract>;

  publicRemoveMe(requestUser: RequestUser): Promise<void>;

  adminCreate(
    dto: CreateUserRequestContract,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResponseContract>;

  adminFindAll(
    query: UserQueryRequestContract,
  ): Promise<PagOffsetResultDto<UserResponseContract>>;

  adminFindOne(id: string): Promise<UserResponseContract>;

  adminUpdate(
    id: string,
    dto: UpdateUserRequestContract,
    requestUser: RequestUser,
  ): Promise<UserResponseContract>;

  adminRemove(id: string, requestUser: RequestUser): Promise<void>;
}
