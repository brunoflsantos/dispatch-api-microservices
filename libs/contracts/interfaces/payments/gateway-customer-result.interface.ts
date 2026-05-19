import {
  CreateGatewayCustomerAddressInput,
  CreateGatewayCustomerInput,
  CreateGatewayCustomerMetadataInput,
} from './create-gateway-customer-input.interface';

export interface GatewayCustomerMetadataResult extends CreateGatewayCustomerMetadataInput {}

export interface GatewayCustomerAddressResult extends CreateGatewayCustomerAddressInput {}

export interface GatewayCustomerResult extends Omit<
  CreateGatewayCustomerInput,
  'metadata' | 'address' | 'idempotencyKey'
> {
  id: string;

  metadata?: GatewayCustomerMetadataResult;

  address?: GatewayCustomerAddressResult;
}
