import { Role } from 'libs/common/enums/role.enum';
import { CreateAddressInput } from './create-address-input.interface';

export interface CreateUserInput {
  name: string;

  email: string;

  password: string;

  language?: string;

  role?: Role;

  address?: CreateAddressInput;
}

export interface PublicCreateUserInput extends Omit<CreateUserInput, 'role'> {}
