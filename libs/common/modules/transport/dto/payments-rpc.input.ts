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
import { BaseRpcInput } from './base.input';

interface PaymentsTransportPayloads {
  CREATE_CUSTOMER: { input: CreateCustomerInput };
  FIND_ALL_CUSTOMERS: { cursor?: CursorQueryInput };
  FIND_ONE_CUSTOMER: { customerId: string };
  UPDATE_CUSTOMER: { customerId: string; input: UpdateCustomerInput };
  DELETE_CUSTOMER: { customerId: string };

  CREATE_PAYMENT: { input: CreatePaymentInput };
  FIND_ONE_PAYMENT: { paymentId: string };

  CREATE_REFUND_PAYMENT: { input: CreateRefundInput };
  FIND_ONE_REFUND_PAYMENT: { refundId: string };

  PROCESS_WEBHOOK: { input: ProcessPaymentWebhookInput };
}

interface PaymentsTransportResponses {
  CREATE_CUSTOMER: CustomerResult;
  FIND_ALL_CUSTOMERS: PagCursorResultDto<CustomerResult>;
  FIND_ONE_CUSTOMER: CustomerResult;
  UPDATE_CUSTOMER: CustomerResult;
  DELETE_CUSTOMER: void;

  CREATE_PAYMENT: PaymentResult;
  FIND_ONE_PAYMENT: PaymentResult;

  CREATE_REFUND_PAYMENT: RefundResult;
  FIND_ONE_REFUND_PAYMENT: RefundResult;

  PROCESS_WEBHOOK: void;
}

class PaymentsTransportPatterns {
  static readonly CREATE_CUSTOMER = 'payments.create-customer';
  static readonly FIND_ALL_CUSTOMERS = 'payments.find-all-customers';
  static readonly FIND_ONE_CUSTOMER = 'payments.find-one-customer';
  static readonly UPDATE_CUSTOMER = 'payments.update-customer';
  static readonly DELETE_CUSTOMER = 'payments.delete-customer';
  static readonly CREATE_PAYMENT = 'payments.create-payment';
  static readonly FIND_ONE_PAYMENT = 'payments.find-one-payment';
  static readonly CREATE_REFUND_PAYMENT = 'payments.create-refund-payment';
  static readonly FIND_ONE_REFUND_PAYMENT = 'payments.find-one-refund-payment';
  static readonly PROCESS_WEBHOOK = 'payments.process-webhook';
}

export abstract class BasePaymentsRpcInput extends BaseRpcInput {}

export class CreateCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_CUSTOMER;

  public response = null as unknown as PaymentsTransportResponses['CREATE_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['CREATE_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class FindAllCustomersRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ALL_CUSTOMERS;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ALL_CUSTOMERS'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ALL_CUSTOMERS'],
  ) {
    super(payload);
  }
}

export class FindOneCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_CUSTOMER;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class UpdateCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.UPDATE_CUSTOMER;

  public response = null as unknown as PaymentsTransportResponses['UPDATE_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['UPDATE_CUSTOMER'],
  ) {
    super(payload);
  }
}

export class DeleteCustomerRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.DELETE_CUSTOMER;

  public response = null as unknown as PaymentsTransportResponses['DELETE_CUSTOMER'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['DELETE_CUSTOMER'],
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

export class CreateRefundPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.CREATE_REFUND_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['CREATE_REFUND_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['CREATE_REFUND_PAYMENT'],
  ) {
    super(payload);
  }
}

export class FindOneRefundPaymentRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.FIND_ONE_REFUND_PAYMENT;

  public response =
    null as unknown as PaymentsTransportResponses['FIND_ONE_REFUND_PAYMENT'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['FIND_ONE_REFUND_PAYMENT'],
  ) {
    super(payload);
  }
}

export class ProcessWebhookRpcInput extends BasePaymentsRpcInput {
  public static pattern = PaymentsTransportPatterns.PROCESS_WEBHOOK;

  public response = null as unknown as PaymentsTransportResponses['PROCESS_WEBHOOK'];

  constructor(
    public readonly payload: PaymentsTransportPayloads['PROCESS_WEBHOOK'],
  ) {
    super(payload);
  }
}
