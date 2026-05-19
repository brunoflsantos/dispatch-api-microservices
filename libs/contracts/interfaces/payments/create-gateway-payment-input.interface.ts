export interface CreateGatewayPaymentMetadataInput {
  orderId: string;
}

export interface CreateGatewayPaymentInput {
  amount: number;

  currency: string;

  customerId?: string;

  receiptEmail?: string;

  metadata?: CreateGatewayPaymentMetadataInput;

  idempotencyKey: string;
}
