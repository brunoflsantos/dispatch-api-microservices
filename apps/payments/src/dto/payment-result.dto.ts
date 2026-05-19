import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';

export class PaymentResultDto implements PaymentResult {
  id: string;

  orderId: string;

  userId: string;

  stripePaymentIntentId: string;

  stripeClientSecret: string;

  status: string;
}
