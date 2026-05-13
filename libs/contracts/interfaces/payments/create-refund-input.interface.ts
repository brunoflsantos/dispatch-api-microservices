export interface CreateRefundInput {
  paymentId: string;

  amount: number;

  idempotencyKey: string;
}
