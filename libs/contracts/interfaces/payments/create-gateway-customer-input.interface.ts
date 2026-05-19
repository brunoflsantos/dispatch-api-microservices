export interface CreateGatewayCustomerMetadataInput {
  userId: string;
}

export interface CreateGatewayCustomerAddressInput {
  city?: string;

  country?: string;

  line1?: string;

  line2?: string;

  postalCode?: string;

  state?: string;
}

export interface CreateGatewayCustomerInput {
  email: string;

  name: string;

  address?: CreateGatewayCustomerAddressInput;

  metadata?: CreateGatewayCustomerMetadataInput;

  idempotencyKey: string;
}
