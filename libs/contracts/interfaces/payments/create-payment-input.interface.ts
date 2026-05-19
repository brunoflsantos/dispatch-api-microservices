import { CreateGatewayPaymentInput } from './create-gateway-payment-input.interface';

export interface CreatePaymentInput {
  orderId: string;

  userId: string;

  gatewayDto: CreateGatewayPaymentInput;
}
