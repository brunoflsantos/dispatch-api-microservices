import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { join } from 'path';
import { PAYMENT_GATEWAY_PORT } from './constants/payments.token';
import { StripePort } from './gateways/stripe/providers/stripe-port';
import { StripeModule } from './gateways/stripe/stripe.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),
    StripeModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: PAYMENT_GATEWAY_PORT,
      useClass: StripePort,
    },
  ],
})
export class PaymentsModule {}
