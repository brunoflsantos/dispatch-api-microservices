import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CursorQueryInput } from 'libs/contracts/interfaces/cursor-query-input.interface';
import { CreateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/create-gateway-customer-input.interface';
import { CreateGatewayPaymentInput } from 'libs/contracts/interfaces/payments/create-gateway-payment-input.interface';
import { CreateGatewayRefundInput } from 'libs/contracts/interfaces/payments/create-gateway-refund-input.interface';
import { GatewayCustomerResult } from 'libs/contracts/interfaces/payments/gateway-customer-result.interface';
import { GatewayPaymentResult } from 'libs/contracts/interfaces/payments/gateway-payment-result.interface';
import { GatewayRefundResult } from 'libs/contracts/interfaces/payments/gateway-refund-result.interface';
import { ProcessGatewayWebhookInput } from 'libs/contracts/interfaces/payments/process-gateway-webhook-input.interface';
import { UpdateGatewayCustomerInput } from 'libs/contracts/interfaces/payments/update-gateway-customer-input.interface';

export interface PaymentsGatewayPort {
  createCustomer(input: CreateGatewayCustomerInput): Promise<GatewayCustomerResult>;

  findAllCustomers(
    cursor?: CursorQueryInput,
  ): Promise<PagCursorResultDto<GatewayCustomerResult>>;

  findOneCustomer(customerId: string): Promise<GatewayCustomerResult>;

  updateCustomer(
    customerId: string,
    input: UpdateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult>;

  deleteCustomer(customerId: string): Promise<void>;

  createPayment(input: CreateGatewayPaymentInput): Promise<GatewayPaymentResult>;

  findOnePayment(paymentId: string): Promise<GatewayPaymentResult>;

  createRefundPayment(input: CreateGatewayRefundInput): Promise<GatewayRefundResult>;

  findOneRefundPayment(refundId: string): Promise<GatewayRefundResult>;

  processWebhook(input: ProcessGatewayWebhookInput): Promise<void>;
}
