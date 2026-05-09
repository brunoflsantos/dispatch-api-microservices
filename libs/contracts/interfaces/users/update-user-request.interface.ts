import {
  CreateUserAddressRequestContract,
  CreateUserRequestContract,
} from './create-user-request.interface';

export interface UpdateUserAddressRequestContract extends Partial<CreateUserAddressRequestContract> {}

export interface UpdateUserRequestContract extends Partial<CreateUserRequestContract> {
  currentPassword?: string;
}

export interface PublicUpdateUserRequestContract extends Omit<
  UpdateUserRequestContract,
  'role'
> {}
