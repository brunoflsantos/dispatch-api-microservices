import {
  CreateCustomerAddressInput,
  CreateCustomerInput,
  CreateCustomerMetadataInput,
} from './create-customer-input.interface';

export interface UpdateCustomerMetadataInput extends Partial<CreateCustomerMetadataInput> {}

export interface UpdateCustomerAddressInput extends Partial<CreateCustomerAddressInput> {}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}
