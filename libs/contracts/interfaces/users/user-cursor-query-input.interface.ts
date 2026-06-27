import { BaseCursorQueryInput } from '../base-cursor-query-input.interface';

export interface UserCursorQueryInput extends BaseCursorQueryInput {
  name?: string;

  email?: string;
}

export interface PublicUserCursorQueryInput extends Pick<
  UserCursorQueryInput,
  'name' | 'cursor'
> {}
