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

export interface PaymentsGatewayPort {
  createCustomer(input: CreateCustomerInput): Promise<CustomerResult>;

  findAllCustomers(
    cursor?: CursorQueryInput,
  ): Promise<PagCursorResultDto<CustomerResult>>;

  findOneCustomer(customerId: string): Promise<CustomerResult>;

  updateCustomer(
    customerId: string,
    input: UpdateCustomerInput,
  ): Promise<CustomerResult>;

  deleteCustomer(customerId: string): Promise<void>;

  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;

  findOnePayment(paymentId: string): Promise<PaymentResult>;

  createRefundPayment(input: CreateRefundInput): Promise<RefundResult>;

  findOneRefundPayment(refundId: string): Promise<RefundResult>;

  processWebhook(input: ProcessPaymentWebhookInput): Promise<void>;
}
