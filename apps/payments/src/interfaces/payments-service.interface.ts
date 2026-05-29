import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { CreateCustomerInput } from 'libs/contracts/interfaces/payments/create-customer-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { CreateRefundInput } from 'libs/contracts/interfaces/payments/create-refund-input.interface';
import { CustomerResult } from 'libs/contracts/interfaces/payments/customer-result.interface';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';
import { RefundResult } from 'libs/contracts/interfaces/payments/refund-result.interface';
import { UpdateCustomerInput } from 'libs/contracts/interfaces/payments/update-customer-input.interface';

export interface IPaymentsService extends IBaseService {
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;

  findAllPayments(
    query: PaymentCursorQueryInput,
  ): Promise<PagCursorResultDto<PaymentResult>>;

  findOnePayment(paymentId: string): Promise<PaymentResult>;

  findPaymentByOrderId(orderId: string): Promise<PaymentResult>;

  createCustomer(
    input: CreateCustomerInput,
    idempotencyKey: string,
  ): Promise<CustomerResult>;

  updateCustomer(input: UpdateCustomerInput): Promise<CustomerResult>;

  deleteCustomer(userId: string): Promise<void>;

  createRefund(
    input: CreateRefundInput,
    idempotencyKey: string,
  ): Promise<RefundResult>;
}
