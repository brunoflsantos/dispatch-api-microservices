import {
  CreateGatewayCustomerAddressInput,
  CreateGatewayCustomerInput,
  CreateGatewayCustomerMetadataInput,
} from './create-gateway-customer-input.interface';

export interface UpdateGatewayCustomerMetadataInput extends Partial<CreateGatewayCustomerMetadataInput> {}

export interface UpdateGatewayCustomerAddressInput extends Partial<CreateGatewayCustomerAddressInput> {}

export interface UpdateGatewayCustomerInput extends Partial<CreateGatewayCustomerInput> {}
