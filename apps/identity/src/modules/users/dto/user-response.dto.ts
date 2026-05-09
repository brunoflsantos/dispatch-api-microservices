import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'libs/common/enums/user-role.enum';
import { UserResponseContract } from 'libs/contracts/interfaces/users/user-response.interface';
import { UserAddressResponseDto } from './user-address-response.dto';

@Exclude()
export class UserResponseDto implements UserResponseContract {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  language: string;

  @Expose()
  address?: UserAddressResponseDto;
}
