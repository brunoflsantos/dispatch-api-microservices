import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { template } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateCustomerInput } from 'libs/contracts/interfaces/payments/create-customer-input.interface';
import { CreatePaymentInput } from 'libs/contracts/interfaces/payments/create-payment-input.interface';
import { CreateRefundInput } from 'libs/contracts/interfaces/payments/create-refund-input.interface';
import { CustomerResult } from 'libs/contracts/interfaces/payments/customer-result.interface';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { PaymentResult } from 'libs/contracts/interfaces/payments/payment-result.interface';
import { RefundResult } from 'libs/contracts/interfaces/payments/refund-result.interface';
import { UpdateCustomerInput } from 'libs/contracts/interfaces/payments/update-customer-input.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { I18N_PAYMENTS } from './constants/i18n.constant';
import {
  CUSTOMER_REPOSITORY,
  PAYMENTS_GATEWAY_PORT,
  PAYMENT_REPOSITORY,
  REFUND_REPOSITORY,
} from './constants/payments.token';
import { CustomerResultDto } from './dto/customer-result.dto';
import { PaymentResultDto } from './dto/payment-result.dto';
import { RefundResultDto } from './dto/refund-result.dto';
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

  //#region Payments

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const gatewayPayment = await this.paymentsGateway.createPayment(
      input.gatewayDto,
    );

    const payment = this.paymentRepository.createEntity({
      orderId: input.orderId,
      userId: input.userId,
      stripePaymentIntentId: gatewayPayment.id,
      stripeClientSecret: gatewayPayment.secret,
      status: gatewayPayment.status,
    });
    const saved = await this.paymentRepository.save(payment);

    return EntityMapper.map(saved, PaymentResultDto);
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

  //#region Customers

  async createCustomer(
    input: CreateCustomerInput,
    idempotencyKey: string,
  ): Promise<CustomerResult> {
    const gatewayCustomer = await this.paymentsGateway.createCustomer({
      email: input.email,
      name: input.name,
      idempotencyKey,
    });
    const customer = this.customerRepository.createEntity({
      gatewayCustomerId: gatewayCustomer.id,
      userId: input.userId,
      email: input.email,
      name: input.name,
    });
    const saved = await this.customerRepository.save(customer);

    return EntityMapper.map(saved, CustomerResultDto);
  }

  async updateCustomer(input: UpdateCustomerInput): Promise<CustomerResult> {
    const customer = await this.customerRepository.findOne({
      where: { userId: input.userId },
    });
    if (!customer) {
      throw new NotFoundException(
        template(I18N_PAYMENTS.ERRORS.CUSTOMER_NOT_FOUND, {
          userId: input.userId,
        }),
      );
    }

    await this.paymentsGateway.updateCustomer(customer.gatewayCustomerId, {
      email: input.email,
      name: input.name,
    });

    customer.email = input.email;
    customer.name = input.name;
    await this.customerRepository.update(customer.id, customer);

    return EntityMapper.map(customer, CustomerResultDto);
  }

  async deleteCustomer(userId: string): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (!customer) {
      throw new NotFoundException(
        template(I18N_PAYMENTS.ERRORS.CUSTOMER_NOT_FOUND, { userId }),
      );
    }

    await this.paymentsGateway.deleteCustomer(customer.gatewayCustomerId);
    await this.customerRepository.softRemove(customer);
  }

  //#endregion

  //#region Refunds

  async createRefund(
    input: CreateRefundInput,
    idempotencyKey: string,
  ): Promise<RefundResult> {
    const payment = await this.paymentRepository.findOne({
      where: { orderId: input.orderId },
    });
    if (!payment) {
      throw new NotFoundException(
        template(I18N_PAYMENTS.ERRORS.PAYMENT_NOT_FOUND, { orderId: input.orderId }),
      );
    }
    const refundGateway = await this.paymentsGateway.createRefundPayment({
      paymentId: payment.id,
      amount: input.amount,
      idempotencyKey,
    });
    const refund = this.refundRepository.createEntity({
      paymentId: payment.id,
      amount: input.amount,
      gatewayRefundId: refundGateway.refundId,
    });
    const saved = await this.refundRepository.save(refund);

    return EntityMapper.map(saved, RefundResultDto);
  }

  //#endregion
}
