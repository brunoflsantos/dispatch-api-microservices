import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { join } from 'path';
import {
  CUSTOMER_REPOSITORY,
  PAYMENT_REPOSITORY,
  PAYMENTS_GATEWAY_PORT,
  PAYMENTS_SERVICE,
  REFUND_REPOSITORY,
} from './constants/payments.token';
import { Customer } from './entities/customer.entity';
import { Payment } from './entities/payment.entity';
import { Refund } from './entities/refund.entity';
import { StripePort } from './gateways/stripe/providers/stripe-port';
import { StripeController } from './gateways/stripe/stripe.controller';
import { StripeModule } from './gateways/stripe/stripe.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CustomerRepository } from './providers/customer.repository';
import { PaymentRepository } from './providers/payment.repository';
import { RefundRepository } from './providers/refund.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Refund, Customer]),
    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),
    StripeModule,
  ],
  controllers: [PaymentsController, StripeController],
  providers: [
    {
      provide: PAYMENTS_SERVICE,
      useClass: PaymentsService,
    },
    {
      provide: PAYMENTS_GATEWAY_PORT,
      useClass: StripePort,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
    {
      provide: REFUND_REPOSITORY,
      useClass: RefundRepository,
    },
  ],
})
export class PaymentsModule {}
