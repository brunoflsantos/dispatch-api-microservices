export interface PaymentResult {
  id: string;

  orderId: string;

  userId: string;

  stripePaymentIntentId: string;

  stripeClientSecret: string;

  status: string;
}
