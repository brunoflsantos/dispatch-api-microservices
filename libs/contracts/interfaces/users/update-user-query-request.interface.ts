import { BaseQueryRequestContract } from '../base-query-request.interface';

export interface UserQueryRequestContract extends BaseQueryRequestContract {
  name?: string;

  email?: string;
}

export interface PublicUserQueryRequestContract extends Pick<
  UserQueryRequestContract,
  'name'
> {}
