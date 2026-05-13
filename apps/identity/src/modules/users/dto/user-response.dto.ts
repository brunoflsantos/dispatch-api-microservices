import { Exclude, Expose } from 'class-transformer';
import { Role } from 'libs/common/enums/role.enum';
import { UserResult } from 'libs/contracts/interfaces/users/user-result.interface';
import { UserAddressResponseDto } from './user-address-response.dto';

@Exclude()
export class UserResponseDto implements UserResult {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  language: string;

  @Expose()
  address?: UserAddressResponseDto;
}
