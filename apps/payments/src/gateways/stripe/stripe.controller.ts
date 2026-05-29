import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBody,
} from '@nestjs/common';
import { Public } from 'libs/common/decorators/public.decorator';
import { StripePort } from './providers/stripe-port';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripePort: StripePort) {}

  @Post('webhook')
  @Public()
  @HttpCode(200)
  async processWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException("The 'stripe-signature' header is required.");
    }
    return this.stripePort.processWebhook({
      eventType: 'stripe-webhook',
      payload: rawBody,
      signature,
    });
  }
}
