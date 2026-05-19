import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProcessStripeWebhookRpcInput } from 'libs/common/modules/transport/dto/payments-rpc.input';
import { StripePort } from './providers/stripe-port';

@Controller()
export class StripeController {
  constructor(private readonly stripePort: StripePort) {}

  @MessagePattern(ProcessStripeWebhookRpcInput.pattern)
  async processWebhook(
    @Payload() payload: ProcessStripeWebhookRpcInput['payload'],
  ): Promise<ProcessStripeWebhookRpcInput['response']> {
    return this.stripePort.processWebhook({
      eventType: 'stripe-webhook',
      payload: payload.request.rawBody,
      signature: payload.signature,
    });
  }
}
