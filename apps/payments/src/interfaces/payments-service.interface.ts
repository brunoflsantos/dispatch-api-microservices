import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { CursorQueryInput } from 'libs/contracts/interfaces/cursor-query-input.interface';
import { CreateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/create-gateway-customer-input.interface';
import { CreateGatewayPaymentInput } from 'libs/contracts/interfaces/payments/create-gateway-payment-input.interface';
import { CreateGatewayRefundInput } from 'libs/contracts/interfaces/payments/create-gateway-refund-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { GatewayCustomerResult } from 'libs/contracts/interfaces/payments/gateway-customer-result.interface';
import { GatewayPaymentResult } from 'libs/contracts/interfaces/payments/gateway-payment-result.interface';
import { GatewayRefundResult } from 'libs/contracts/interfaces/payments/gateway-refund-result.interface';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';
import { ProcessGatewayWebhookInput } from 'libs/contracts/interfaces/payments/process-gateway-webhook-input.interface';
import { UpdateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/update-gateway-customer-input.interface';

export interface IPaymentsService extends IBaseService {
  createGatewayCustomer(
    input: CreateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult>;

  findAllGatewayCustomers(
    cursor?: CursorQueryInput,
  ): Promise<PagCursorResultDto<GatewayCustomerResult>>;

  findOneGatewayCustomer(customerId: string): Promise<GatewayCustomerResult>;

  updateGatewayCustomer(
    customerId: string,
    input: UpdateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult>;

  deleteGatewayCustomer(customerId: string): Promise<void>;

  createGatewayPayment(
    input: CreateGatewayPaymentInput,
  ): Promise<GatewayPaymentResult>;

  findOneGatewayPayment(paymentId: string): Promise<GatewayPaymentResult>;

  createGatewayRefundPayment(
    input: CreateGatewayRefundInput,
  ): Promise<GatewayRefundResult>;

  findOneGatewayRefundPayment(refundId: string): Promise<GatewayRefundResult>;

  processGatewayWebhook(input: ProcessGatewayWebhookInput): Promise<void>;

  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;

  findAllPayments(
    query: PaymentCursorQueryInput,
  ): Promise<PagCursorResultDto<PaymentResult>>;

  findOnePayment(paymentId: string): Promise<PaymentResult>;

  findPaymentByOrderId(orderId: string): Promise<PaymentResult>;
}
