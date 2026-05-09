import { Exclude, Expose } from 'class-transformer';
import { UserSelfResponseContract } from 'libs/contracts/interfaces/users/user-response.interface';
import { UserAddressResponseDto } from './user-address-response.dto';

@Exclude()
export class UserSelfResponseDto implements UserSelfResponseContract {
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
