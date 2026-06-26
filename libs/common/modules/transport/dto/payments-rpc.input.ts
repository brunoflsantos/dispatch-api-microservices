import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/create-gateway-customer-input.interface';
import { CreateGatewayPaymentInput } from 'libs/contracts/interfaces/payments/create-gateway-payment-input.interface';
import { CreateGatewayRefundInput } from 'libs/contracts/interfaces/payments/create-gateway-refund-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { GatewayCustomerResult } from 'libs/contracts/interfaces/payments/gateway-customer-result.interface';
import { GatewayPaymentResult } from 'libs/contracts/interfaces/payments/gateway-payment-result.interface';
import { GatewayRefundResult } from 'libs/contracts/interfaces/payments/gateway-refund-result.interface';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';
import { UpdateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/update-gateway-customer-input.interface';
import { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { BaseRpcInput } from './base.input';

interface PaymentsTransportPayloads {
  CREATE_GATEWAY_CUSTOMER: { input: CreateGatewayCustomerInput };
  FIND_ALL_GATEWAY_CUSTOMERS: { cursor?: CursorParams };
  FIND_ONE_GATEWAY_CUSTOMER: { customerId: string };
  UPDATE_GATEWAY_CUSTOMER: { customerId: string; input: UpdateGatewayCustomerInput };
  DELETE_GATEWAY_CUSTOMER: { customerId: string };

  CREATE_GATEWAY_PAYMENT: { input: CreateGatewayPaymentInput };
  FIND_ONE_GATEWAY_PAYMENT: { paymentId: string };

  CREATE_GATEWAY_REFUND_PAYMENT: { input: CreateGatewayRefundInput };
  FIND_ONE_GATEWAY_REFUND_PAYMENT: { refundId: string };

  CREATE_PAYMENT: { input: CreatePaymentInput };
  FIND_ALL_PAYMENTS: { query: PaymentCursorQueryInput };
  FIND_ONE_PAYMENT: { paymentId: string };
  FIND_PAYMENT_BY_ORDER_ID: { orderId: string };

  PROCESS_STRIPE_WEBHOOK: {
    request: Request & { rawBody?: Buffer };
    signature: string;
  };
}

interface PaymentsTransportResponses {
  CREATE_GATEWAY_CUSTOMER: GatewayCustomerResult;
  FIND_ALL_GATEWAY_CUSTOMERS: PagCursorResultDto<GatewayCustomerResult>;
  FIND_ONE_GATEWAY_CUSTOMER: GatewayCustomerResult;
  UPDATE_GATEWAY_CUSTOMER: GatewayCustomerResult;
  DELETE_GATEWAY_CUSTOMER: void;

  CREATE_GATEWAY_PAYMENT: GatewayPaymentResult;
  FIND_ONE_GATEWAY_PAYMENT: GatewayPaymentResult;

  CREATE_GATEWAY_REFUND_PAYMENT: GatewayRefundResult;
  FIND_ONE_GATEWAY_REFUND_PAYMENT: GatewayRefundResult;

  CREATE_PAYMENT: PaymentResult;
  FIND_ALL_PAYMENTS: PagCursorResultDto<PaymentResult>;
  FIND_ONE_PAYMENT: PaymentResult;
  FIND_PAYMENT_BY_ORDER_ID: PaymentResult;

  PROCESS_STRIPE_WEBHOOK: void;
}

class PaymentsTransportPatterns {
  static readonly CREATE_GATEWAY_CUSTOMER = 'payments.create-gateway-customer';
  static readonly FIND_ALL_GATEWAY_CUSTOMERS = 'payments.find-all-gateway-customers';
  static readonly FIND_ONE_GATEWAY_CUSTOMER = 'payments.find-one-gateway-customer';
  static readonly UPDATE_GATEWAY_CUSTOMER = 'payments.update-gateway-customer';
  static readonly DELETE_GATEWAY_CUSTOMER = 'payments.delete-gateway-customer';
  static readonly CREATE_GATEWAY_PAYMENT = 'payments.create-gateway-payment';
  static readonly FIND_ONE_GATEWAY_PAYMENT = 'payments.find-one-gateway-payment';
  static readonly CREATE_GATEWAY_REFUND_PAYMENT =
    'payments.create-gateway-refund-payment';
  static readonly FIND_ONE_GATEWAY_REFUND_PAYMENT =
    'payments.find-one-gateway-refund-payment';

  static readonly CREATE_PAYMENT = 'payments.create-payment';
  static readonly FIND_ALL_PAYMENTS = 'payments.find-all-payments';
  static readonly FIND_ONE_PAYMENT = 'payments.find-one-payment';
  static readonly FIND_PAYMENT_BY_ORDER_ID = 'payments.find-payment-by-order-id';

  static readonly PROCESS_STRIPE_WEBHOOK = 'payments.process-stripe-webhook';
}

export abstract class BasePaymentsRpcInput extends BaseRpcInput {}

export class CreateGatewayCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_GATEWAY_CUSTOMER;

  public response =
    null as unknown as PaymentsTransportResponses['CREATE_GATEWAY_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['CREATE_GATEWAY_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class FindAllGatewayCustomersRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ALL_GATEWAY_CUSTOMERS;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ALL_GATEWAY_CUSTOMERS'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ALL_GATEWAY_CUSTOMERS'],
  ) {
    super(payload);
  }
}

export class FindOneGatewayCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_GATEWAY_CUSTOMER;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_GATEWAY_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_GATEWAY_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class UpdateGatewayCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.UPDATE_GATEWAY_CUSTOMER;

  public response =
    null as unknown as PaymentsTransportResponses['UPDATE_GATEWAY_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['UPDATE_GATEWAY_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class DeleteGatewayCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.DELETE_GATEWAY_CUSTOMER;

  public response =
    null as unknown as PaymentsTransportResponses['DELETE_GATEWAY_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['DELETE_GATEWAY_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class CreateGatewayPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_GATEWAY_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['CREATE_GATEWAY_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['CREATE_GATEWAY_PAYMENT'],
  ) {
    super(payload);
  }
}

export class FindOneGatewayPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_GATEWAY_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_GATEWAY_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_GATEWAY_PAYMENT'],
  ) {
    super(payload);
  }
}

export class CreateGatewayRefundPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_GATEWAY_REFUND_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['CREATE_GATEWAY_REFUND_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['CREATE_GATEWAY_REFUND_PAYMENT'],
  ) {
    super(payload);
  }
}

export class FindOneGatewayRefundPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_GATEWAY_REFUND_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_GATEWAY_REFUND_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_GATEWAY_REFUND_PAYMENT'],
  ) {
    super(payload);
  }
}

export class CreatePaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_PAYMENT;

  public response = null as unknown as PaymentsTransportResponses['CREATE_PAYMENT'];

  constructor(public readonly payload: PaymentsTransportPayloads['CREATE_PAYMENT']) {
    super(payload);
  }
}

export class FindAllPaymentsRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ALL_PAYMENTS;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ALL_PAYMENTS'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ALL_PAYMENTS'],
  ) {
    super(payload);
  }
}

export class FindOnePaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_PAYMENT'],
  ) {
    super(payload);
  }
}

export class FindPaymentByOrderIdRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_PAYMENT_BY_ORDER_ID;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_PAYMENT_BY_ORDER_ID'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_PAYMENT_BY_ORDER_ID'],
  ) {
    super(payload);
  }
}

export class ProcessStripeWebhookRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.PROCESS_STRIPE_WEBHOOK;

  public response =
    null as unknown as PaymentsTransportResponses['PROCESS_STRIPE_WEBHOOK'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['PROCESS_STRIPE_WEBHOOK'],
  ) {
    super(payload);
  }
}
