import { OffsetQueryInput } from '../offset-query-input.interface';

export interface UserQueryRequestInput extends OffsetQueryInput {
  name?: string;

  email?: string;
}

export interface PublicUserQueryInput extends Pick<UserQueryRequestInput, 'name'> {}
