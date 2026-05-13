import Stripe from 'stripe';

export type StripeCustomerCreateParams = Parameters<
  Stripe.Stripe['customers']['create']
>[0];

export type StripeCustomer = Awaited<
  ReturnType<Stripe.Stripe['customers']['list']>
>['data'][number];

export type StripePaymentIntentCreateParams = Parameters<
  Stripe.Stripe['paymentIntents']['create']
>[0];

export type StripePaymentIntent = Awaited<
  ReturnType<Stripe.Stripe['paymentIntents']['retrieve']>
>;

export type StripeRefundCreateParams = Parameters<
  Stripe.Stripe['refunds']['create']
>[0];

export type StripeRefund = Awaited<ReturnType<Stripe.Stripe['refunds']['retrieve']>>;

export type StripeRefundReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer';

export type StripeEvent = Awaited<
  ReturnType<Stripe.Stripe['webhooks']['constructEvent']>
>;

export type StripeWebhookResult = { received: true };
