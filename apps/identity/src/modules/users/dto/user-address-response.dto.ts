import { Exclude, Expose } from 'class-transformer';
import { AddressResult } from 'libs/contracts/interfaces/users/address-result.interface';

@Exclude()
export class UserAddressResponseDto implements AddressResult {
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
