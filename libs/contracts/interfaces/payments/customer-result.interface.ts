import {
  CreateCustomerAddressInput,
  CreateCustomerInput,
  CreateCustomerMetadataInput,
} from './create-customer-input.interface';

export interface CustomerMetadataResult extends CreateCustomerMetadataInput {}

export interface CustomerAddressResult extends CreateCustomerAddressInput {}

export interface CustomerResult extends Omit<
  CreateCustomerInput,
  'metadata' | 'address' | 'idempotencyKey'
> {
  id: string;

  metadata?: CustomerMetadataResult;

  address?: CustomerAddressResult;
}
