import { Inject, Injectable } from '@nestjs/common';
import { CursorQueryInput } from 'libs/contracts/interfaces/cursor-query-input.interface';
import { CreateCustomerInput } from 'libs/contracts/interfaces/payments/create-customer-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { CreateRefundInput } from 'libs/contracts/interfaces/payments/create-refund-input.interface';
import { ProcessPaymentWebhookInput } from 'libs/contracts/interfaces/payments/process-webhook-input.interface';
import { UpdateCustomerInput } from 'libs/contracts/interfaces/payments/update-customer-input.interface';
import { PAYMENT_GATEWAY_PORT } from './constants/payments.token';
import type { PaymentsGatewayPort } from './interfaces/payments-gateway-port.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PAYMENT_GATEWAY_PORT)
    private readonly paymentsGateway: PaymentsGatewayPort,
  ) {}

  createCustomer(input: CreateCustomerInput) {
    return this.paymentsGateway.createCustomer(input);
  }

  findAllCustomers(cursor?: CursorQueryInput) {
    return this.paymentsGateway.findAllCustomers(cursor);
  }

  findOneCustomer(customerId: string) {
    return this.paymentsGateway.findOneCustomer(customerId);
  }

  updateCustomer(customerId: string, input: UpdateCustomerInput) {
    return this.paymentsGateway.updateCustomer(customerId, input);
  }

  deleteCustomer(customerId: string) {
    return this.paymentsGateway.deleteCustomer(customerId);
  }

  createPayment(input: CreatePaymentInput) {
    return this.paymentsGateway.createPayment(input);
  }

  findOnePayment(paymentId: string) {
    return this.paymentsGateway.findOnePayment(paymentId);
  }

  createRefundPayment(input: CreateRefundInput) {
    return this.paymentsGateway.createRefundPayment(input);
  }

  findOneRefundPayment(refundId: string) {
    return this.paymentsGateway.findOneRefundPayment(refundId);
  }

  processWebhook(input: ProcessPaymentWebhookInput) {
    return this.paymentsGateway.processWebhook(input);
  }
}
