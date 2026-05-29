import { RefundResult } from 'libs/contracts/interfaces/payments/refund-result.interface';

export class RefundResultDto implements RefundResult {
  id: string;

  paymentId: string;

  amount: number;

  gatewayRefundId: string;
}
