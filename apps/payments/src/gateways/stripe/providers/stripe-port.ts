import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OUTBOX_SERVICE } from 'libs/common/modules/outbox/constants/outbox.token';
import type { IOutboxService } from 'libs/common/modules/outbox/interfaces/outbox-service.interface';
import { ensureError, template } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CursorQueryInput } from 'libs/contracts/interfaces/cursor-query-input.interface';
import { CreateCustomerInput } from 'libs/contracts/interfaces/payments/create-customer-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { CreateRefundInput } from 'libs/contracts/interfaces/payments/create-refund-input.interface';
import { CustomerResult } from 'libs/contracts/interfaces/payments/customer-result.interface';
import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';
import { ProcessPaymentWebhookInput } from 'libs/contracts/interfaces/payments/process-webhook-input.interface';
import { RefundResult } from 'libs/contracts/interfaces/payments/refund-result.interface';
import { UpdateCustomerInput } from 'libs/contracts/interfaces/payments/update-customer-input.interface';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../../../config/payments.config';
import { I18N_PAYMENTS } from '../../../constants/i18n.constant';
import { PaymentsGatewayPort } from '../../../interfaces/payments-gateway-port.interface';
import {
  StripeCustomer,
  StripeCustomerCreateParams,
  StripePaymentIntent,
  StripePaymentIntentCreateParams,
  StripeRefund,
  StripeRefundCreateParams,
} from '../types/stripe.type';

@Injectable()
export class StripePort implements PaymentsGatewayPort {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe.Stripe,
    @Inject(OUTBOX_SERVICE) private readonly outboxService: IOutboxService,
  ) {}

  //#region Customers

  async createCustomer(input: CreateCustomerInput): Promise<CustomerResult> {
    try {
      const inputConverted = this.mapToStripeCustomerCreateParams(input);

      const customer = await this.stripe.customers.create(inputConverted, {
        idempotencyKey: input.idempotencyKey,
      });

      return this.mapToCustomerResult(customer);
    } catch (e) {
      const error = ensureError(e);
      throw new InternalServerErrorException(
        template(I18N_PAYMENTS.ERRORS.CREATE_CUSTOMER_FAILED),
        { cause: error },
      );
    }
  }

  async findAllCustomers(
    cursor?: CursorQueryInput,
  ): Promise<PagCursorResultDto<CustomerResult>> {
    const limit = cursor?.limit || 20;

    const customers = await this.stripe.customers.list({
      limit,
      starting_after: cursor?.startingAfter,
    });

    return {
      items: customers.data.map((customer) => this.mapToCustomerResult(customer)),
      nextCursor: customers.has_more
        ? customers.data[customers.data.length - 1].id
        : undefined,
      hasMore: customers.has_more,
    };
  }

  async findOneCustomer(customerId: string): Promise<CustomerResult> {
    const customer = await this.stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      throw new NotFoundException(
        template(I18N_PAYMENTS.ERRORS.CUSTOMER_NOT_FOUND, { customerId }),
      );
    }
    return this.mapToCustomerResult(customer as StripeCustomer);
  }

  async updateCustomer(
    customerId: string,
    input: UpdateCustomerInput,
  ): Promise<CustomerResult> {
    try {
      const inputConverted = this.mapToStripeCustomerCreateParams(input);

      const customer = await this.stripe.customers.update(
        customerId,
        inputConverted,
      );

      return this.mapToCustomerResult(customer);
    } catch (e) {
      const error = ensureError(e);
      throw new InternalServerErrorException(
        template(I18N_PAYMENTS.ERRORS.UPDATE_CUSTOMER_FAILED),
        { cause: error },
      );
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.stripe.customers.del(customerId);
  }

  //#endregion

  //#region Payments and Refunds

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const inputConverted = this.mapToStripePaymentIntentCreateParams(input);

    const paymentIntent = await this.stripe.paymentIntents.create(inputConverted);

    return this.mapToPaymentResult(paymentIntent);
  }

  async findOnePayment(paymentId: string): Promise<PaymentResult> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
    return this.mapToPaymentResult(paymentIntent);
  }

  async createRefundPayment(input: CreateRefundInput): Promise<RefundResult> {
    const inputConverted = this.mapToRefundCreateParams(input);

    const refund = await this.stripe.refunds.create(inputConverted);

    return this.mapToRefundResult(refund);
  }

  async findOneRefundPayment(refundId: string): Promise<RefundResult> {
    const refund = await this.stripe.refunds.retrieve(refundId);
    return this.mapToRefundResult(refund);
  }

  //#endregion

  //#region Webhooks

  async processWebhook(input: ProcessPaymentWebhookInput): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      input.payload,
      input.signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    if (event.type === 'payment_intent.succeeded') {
      // TODO: add event to outbox for Orders microservice to mark payment as succeeded
    }

    if (event.type === 'payment_intent.payment_failed') {
      // TODO: add event to outbox for Orders microservice to mark payment as failed
    }

    return Promise.resolve();
  }

  //#endregion

  //#region Private Methods

  private mapToStripeCustomerCreateParams(
    input: CreateCustomerInput | UpdateCustomerInput,
  ): StripeCustomerCreateParams {
    return {
      email: input.email,
      name: input.name,
      address: {
        city: input.address?.city,
        country: input.address?.country,
        line1: input.address?.line1,
        line2: input.address?.line2,
        postal_code: input.address?.postalCode,
        state: input.address?.state,
      },
      metadata: {
        userId: input.metadata?.userId,
      },
    };
  }

  private mapToCustomerResult(customer: StripeCustomer): CustomerResult {
    return {
      id: customer.id,
      name: customer.name || undefined,
      email: customer.email || undefined,
      metadata: customer.metadata
        ? {
            userId: customer.metadata.userId,
          }
        : undefined,
      address: customer.address
        ? {
            city: customer.address.city,
            country: customer.address.country,
            line1: customer.address.line1,
            line2: customer.address.line2,
            postalCode: customer.address.postal_code,
            state: customer.address.state,
          }
        : undefined,
    };
  }

  private mapToStripePaymentIntentCreateParams(
    input: CreatePaymentInput,
  ): StripePaymentIntentCreateParams {
    return {
      amount: input.amount,
      currency: input.currency,
      customer: input.customerId,
      metadata: {
        orderId: input.metadata?.orderId,
      },
    };
  }

  private mapToPaymentResult(paymentIntent: StripePaymentIntent): PaymentResult {
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      secret: paymentIntent.client_secret || undefined,
    };
  }

  private mapToRefundCreateParams(
    input: CreateRefundInput,
  ): StripeRefundCreateParams {
    return {
      payment_intent: input.paymentId,
      amount: input.amount,
    };
  }

  private mapToRefundResult(refund: StripeRefund): RefundResult {
    return {
      refundId: refund.id,
      paymentId: refund.payment_intent as string,
      amount: refund.amount,
    };
  }

  //#endregion
}
