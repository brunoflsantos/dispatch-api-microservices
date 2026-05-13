import { CreateUserInput } from './create-user-input.interface';

export interface UpdateUserInput extends Partial<CreateUserInput> {
  currentPassword?: string;
}

export interface PublicUpdateUserInput extends Omit<UpdateUserInput, 'role'> {}
