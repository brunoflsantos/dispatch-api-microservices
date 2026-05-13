import { Role } from 'libs/common/enums/role.enum';
import { AddressResult } from './address-result.interface';

export interface UserResult {
  id: string;

  name: string;

  email: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;

  language: string;

  address?: AddressResult;
}

export interface UserSelfResult extends Omit<UserResult, 'role' | 'updatedAt'> {}

export interface PublicUserResult extends Pick<
  UserResult,
  'id' | 'name' | 'createdAt'
> {}
