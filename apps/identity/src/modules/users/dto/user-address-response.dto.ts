import { Exclude, Expose } from 'class-transformer';
import { UserAddressResponseContract } from 'libs/contracts/interfaces/users/user-result.interface';

@Exclude()
export class UserAddressResponseDto implements UserAddressResponseContract {
  @Expose()
  line1: string;

  @Expose()
  line2?: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  country: string;

  @Expose()
  postalCode: string;
}
