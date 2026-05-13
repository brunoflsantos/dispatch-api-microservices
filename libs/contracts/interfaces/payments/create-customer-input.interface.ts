export interface CreateCustomerMetadataInput {
  userId: string;
}

export interface CreateCustomerAddressInput {
  city?: string;

  country?: string;

  line1?: string;

  line2?: string;

  postalCode?: string;

  state?: string;
}

export interface CreateCustomerInput {
  email: string;

  name: string;

  address?: CreateCustomerAddressInput;

  metadata?: CreateCustomerMetadataInput;

  idempotencyKey: string;
}
