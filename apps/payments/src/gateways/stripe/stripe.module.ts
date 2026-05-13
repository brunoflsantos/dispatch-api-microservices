import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OutboxModule } from 'libs/common/modules/outbox/outbox.module';
import { STRIPE_CLIENT, stripeClient } from '../../config/payments.config';
import { StripePort } from './providers/stripe-port';
import { StripeController } from './stripe.controller';

@Module({
  imports: [OutboxModule],
  controllers: [StripeController],
  exports: [StripePort],
  providers: [
    StripePort,
    {
      provide: STRIPE_CLIENT,
      useFactory: stripeClient,
      inject: [ConfigService],
    },
  ],
})
export class StripeModule {}
