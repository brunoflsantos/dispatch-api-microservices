export interface CreatePaymentMetadataInput {
  orderId: string;
}

export interface CreatePaymentInput {
  amount: number;

  currency: string;

  customerId?: string;

  receiptEmail?: string;

  metadata?: CreatePaymentMetadataInput;

  idempotencyKey: string;
}
