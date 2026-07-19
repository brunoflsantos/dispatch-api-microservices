import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { STRIPE_CLIENT } from 'apps/payments/src/config/payments.config';
import { I18N_PAYMENTS } from 'apps/payments/src/constants/i18n.constant';
import { PaymentsGatewayPort } from 'apps/payments/src/interfaces/payments-gateway-port.interface';
import { OUTBOX_SERVICE } from 'libs/common/modules/outbox/constants/outbox.token';
import type { IOutboxService } from 'libs/common/modules/outbox/interfaces/outbox-service.interface';
import { ensureError, template } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/create-gateway-customer-input.interface';
import { CreateGatewayPaymentInput } from 'libs/contracts/interfaces/payments/create-gateway-payment-input.interface';
import { CreateGatewayRefundInput } from 'libs/contracts/interfaces/payments/create-gateway-refund-input.interface';
import { GatewayCustomerResult } from 'libs/contracts/interfaces/payments/gateway-customer-result.interface';
import { GatewayPaymentResult } from 'libs/contracts/interfaces/payments/gateway-payment-result.interface';
import { GatewayRefundResult } from 'libs/contracts/interfaces/payments/gateway-refund-result.interface';
import { UpdateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/update-gateway-customer-input.interface';
import { CursorParams } from 'libs/contracts/types/cursor-params.type';
import Stripe from 'stripe';
import {
  StripWebhookParams,
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

  async createCustomer(
    input: CreateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult> {
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
    cursor?: CursorParams,
  ): Promise<PagCursorResultDto<GatewayCustomerResult>> {
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

  async findOneCustomer(customerId: string): Promise<GatewayCustomerResult> {
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
    input: UpdateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult> {
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

  //#region Payments

  async createPayment(
    input: CreateGatewayPaymentInput,
  ): Promise<GatewayPaymentResult> {
    const inputConverted = this.mapToStripePaymentIntentCreateParams(input);

    const paymentIntent = await this.stripe.paymentIntents.create(inputConverted, {
      idempotencyKey: input.idempotencyKey,
    });

    return this.mapToPaymentResult(paymentIntent);
  }

  async findOnePayment(paymentId: string): Promise<GatewayPaymentResult> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
    return this.mapToPaymentResult(paymentIntent);
  }

  //#endregion

  //#region Refunds

  async createRefundPayment(
    input: CreateGatewayRefundInput,
  ): Promise<GatewayRefundResult> {
    const inputConverted = this.mapToRefundCreateParams(input);

    const refund = await this.stripe.refunds.create(inputConverted, {
      idempotencyKey: input.idempotencyKey,
    });

    return this.mapToRefundResult(refund);
  }

  async findOneRefundPayment(refundId: string): Promise<GatewayRefundResult> {
    const refund = await this.stripe.refunds.retrieve(refundId);
    return this.mapToRefundResult(refund);
  }

  //#endregion

  //#region Webhooks

  async processWebhook(input: StripWebhookParams): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      input.payload,
      input.signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        // TODO: add event to outbox for Orders microservice to mark payment as succeeded
        break;
      case 'payment_intent.payment_failed':
        // TODO: add event to outbox for Orders microservice to mark payment as failed
        break;
      default:
        console.warn(`Unhandled Stripe webhook event type: ${event.type}`);
    }

    return Promise.resolve();
  }

  //#endregion

  //#region Private

  private mapToStripeCustomerCreateParams(
    input: CreateGatewayCustomerInput | UpdateGatewayCustomerInput,
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

  private mapToCustomerResult(customer: StripeCustomer): GatewayCustomerResult {
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
    input: CreateGatewayPaymentInput,
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

  private mapToPaymentResult(
    paymentIntent: StripePaymentIntent,
  ): GatewayPaymentResult {
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      secret: paymentIntent.client_secret || undefined,
    };
  }

  private mapToRefundCreateParams(
    input: CreateGatewayRefundInput,
  ): StripeRefundCreateParams {
    return {
      payment_intent: input.paymentId,
      amount: input.amount,
    };
  }

  private mapToRefundResult(refund: StripeRefund): GatewayRefundResult {
    return {
      refundId: refund.id,
      paymentId: refund.payment_intent as string,
      amount: refund.amount,
    };
  }

  //#endregion
}
