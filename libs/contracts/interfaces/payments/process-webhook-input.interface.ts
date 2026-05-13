export interface ProcessPaymentWebhookInput {
  eventType: string;

  payload: any;

  signature: string;
}
