export interface ProcessGatewayWebhookInput {
  eventType: string;

  payload: any;

  signature: string;
}
