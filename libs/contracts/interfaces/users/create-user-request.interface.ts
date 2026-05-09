import { UserRole } from 'libs/common/enums/user-role.enum';
import { CreateAddressRequestContract } from './create-address-request.interface';

export interface CreateUserAddressRequestContract extends CreateAddressRequestContract {}

export interface CreateUserRequestContract {
  name: string;

  email: string;

  password: string;

  language?: string;

  role?: UserRole;

  address?: CreateUserAddressRequestContract;
}

export interface PublicCreateUserRequestContract extends Omit<
  CreateUserRequestContract,
  'role'
> {}
