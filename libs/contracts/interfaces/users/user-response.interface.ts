import { UserRole } from 'libs/common/enums/user-role.enum';
import { CreateAddressRequestContract } from './create-address-request.interface';

export interface UserAddressResponseContract extends CreateAddressRequestContract {}

export interface UserResponseContract {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;

  language: string;

  address?: UserAddressResponseContract;
}

export interface UserSelfResponseContract extends Omit<
  UserResponseContract,
  'role' | 'updatedAt'
> {}

export interface PublicUserResponseContract extends Pick<
  UserResponseContract,
  'id' | 'name' | 'createdAt'
> {}
