export interface CreateGatewayRefundInput {
  paymentId: string;

  amount: number;

  idempotencyKey: string;
}
