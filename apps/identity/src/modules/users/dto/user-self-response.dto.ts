import { Exclude, Expose } from 'class-transformer';
import { UserSelfResult } from 'libs/contracts/interfaces/users/user-result.interface';
import { UserAddressResponseDto } from './user-address-response.dto';

@Exclude()
export class UserSelfResponseDto implements UserSelfResult {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  language: string;

  @Expose()
  address?: UserAddressResponseDto;
}
