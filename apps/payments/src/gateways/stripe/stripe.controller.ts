import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'libs/common/decorators/public.decorator';
import { StripePort } from './providers/stripe-port';
import { StripeWebhookResult } from './types/stripe.type';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripePort: StripePort) {}

  @Post('webhook')
  @Public()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe webhook endpoint',
    description:
      'Receives payment gateway events and updates the corresponding order.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature header',
    required: true,
  })
  async processWebhook(
    @Req() request: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') webhookSignature: string,
  ): Promise<StripeWebhookResult> {
    if (!webhookSignature) {
      throw new BadRequestException("The 'stripe-signature' header is required.");
    }

    await this.stripePort.processWebhook({
      eventType: 'stripe-webhook',
      payload: request.rawBody,
      signature: webhookSignature,
    });

    return { received: true };
  }
}
