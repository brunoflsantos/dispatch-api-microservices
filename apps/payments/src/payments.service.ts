import { Inject, Injectable } from '@nestjs/common';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
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
import { BaseService } from 'libs/contracts/services/base.service';
import {
  CUSTOMER_REPOSITORY,
  PAYMENTS_GATEWAY_PORT,
  PAYMENT_REPOSITORY,
  REFUND_REPOSITORY,
} from './constants/payments.token';
import { PaymentResultDto } from './dto/payment-result.dto';
import type { PaymentsGatewayPort } from './interfaces/payments-gateway-port.interface';
import { IPaymentsService } from './interfaces/payments-service.interface';
import { CustomerRepository } from './providers/customer.repository';
import { PaymentRepository } from './providers/payment.repository';
import { RefundRepository } from './providers/refund.repository';

@Injectable()
export class PaymentsService extends BaseService implements IPaymentsService {
  constructor(
    @Inject(PAYMENTS_GATEWAY_PORT)
    private readonly paymentsGateway: PaymentsGatewayPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: RefundRepository,
  ) {
    super(PaymentsService.name);
  }

  //#region Gateway methods

  createGatewayCustomer(
    input: CreateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult> {
    return this.paymentsGateway.createCustomer(input);
  }

  findAllGatewayCustomers(
    cursor?: CursorQueryInput,
  ): Promise<PagCursorResultDto<GatewayCustomerResult>> {
    return this.paymentsGateway.findAllCustomers(cursor);
  }

  findOneGatewayCustomer(customerId: string): Promise<GatewayCustomerResult> {
    return this.paymentsGateway.findOneCustomer(customerId);
  }

  updateGatewayCustomer(
    customerId: string,
    input: UpdateGatewayCustomerInput,
  ): Promise<GatewayCustomerResult> {
    return this.paymentsGateway.updateCustomer(customerId, input);
  }

  deleteGatewayCustomer(customerId: string): Promise<void> {
    return this.paymentsGateway.deleteCustomer(customerId);
  }

  createGatewayPayment(
    input: CreateGatewayPaymentInput,
  ): Promise<GatewayPaymentResult> {
    return this.paymentsGateway.createPayment(input);
  }

  findOneGatewayPayment(paymentId: string): Promise<GatewayPaymentResult> {
    return this.paymentsGateway.findOnePayment(paymentId);
  }

  createGatewayRefundPayment(
    input: CreateGatewayRefundInput,
  ): Promise<GatewayRefundResult> {
    return this.paymentsGateway.createRefundPayment(input);
  }

  findOneGatewayRefundPayment(refundId: string): Promise<GatewayRefundResult> {
    return this.paymentsGateway.findOneRefundPayment(refundId);
  }

  processGatewayWebhook(input: ProcessGatewayWebhookInput): Promise<void> {
    return this.paymentsGateway.processWebhook(input);
  }

  //#endregion

  //#region Entity endpoints

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const gatewayPayment = await this.createGatewayPayment(input.gatewayDto);

    let payment = this.paymentRepository.createEntity({
      orderId: input.orderId,
      userId: input.userId,
      stripePaymentIntentId: gatewayPayment.id,
      stripeClientSecret: gatewayPayment.secret,
      status: gatewayPayment.status,
    });
    payment = await this.paymentRepository.save(payment);

    return EntityMapper.map(payment, PaymentResultDto);
  }

  async findAllPayments(
    query: PaymentCursorQueryInput,
  ): Promise<PagCursorResultDto<PaymentResult>> {
    const payments = await this.paymentRepository.filter(query);

    return new PagCursorResultDto(
      payments.items.map((payment) => EntityMapper.map(payment, PaymentResultDto)),
      payments.nextCursor,
      payments.hasMore,
    );
  }

  findOnePayment(paymentId: string): Promise<PaymentResult> {
    return this.paymentRepository.findById(paymentId);
  }

  findPaymentByOrderId(orderId: string): Promise<PaymentResult> {
    return this.paymentRepository.findOne({ where: { orderId } });
  }

  //#endregion
}
