import { BaseOffsetQueryInput } from '../base-offset-query-input.interface';

export interface UserOffsetQueryInput extends BaseOffsetQueryInput {
  name?: string;

  email?: string;
}

export interface PublicUserOffsetQueryInput extends Pick<
  UserOffsetQueryInput,
  'name'
> {}
