export interface RefundResult {
  id: string;

  paymentId: string;

  amount: number;

  gatewayRefundId: string;
}
