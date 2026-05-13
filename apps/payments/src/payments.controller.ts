import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateCustomerRpcInput,
  CreatePaymentRpcInput,
  CreateRefundPaymentRpcInput,
  DeleteCustomerRpcInput,
  FindAllCustomersRpcInput,
  FindOneCustomerRpcInput,
  FindOnePaymentRpcInput,
  FindOneRefundPaymentRpcInput,
  ProcessWebhookRpcInput,
  UpdateCustomerRpcInput,
} from 'libs/common/modules/transport/dto/payments-rpc.input';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(CreateCustomerRpcInput.pattern)
  createCustomer(
    @Payload() payload: CreateCustomerRpcInput['payload'],
  ): Promise<CreateCustomerRpcInput['response']> {
    return this.paymentsService.createCustomer(payload.input);
  }

  @MessagePattern(FindAllCustomersRpcInput.pattern)
  findAllCustomers(
    @Payload() payload: FindAllCustomersRpcInput['payload'],
  ): Promise<FindAllCustomersRpcInput['response']> {
    return this.paymentsService.findAllCustomers(payload.cursor);
  }

  @MessagePattern(FindOneCustomerRpcInput.pattern)
  findOneCustomer(
    @Payload() payload: FindOneCustomerRpcInput['payload'],
  ): Promise<FindOneCustomerRpcInput['response']> {
    return this.paymentsService.findOneCustomer(payload.customerId);
  }

  @MessagePattern(UpdateCustomerRpcInput.pattern)
  updateCustomer(
    @Payload() payload: UpdateCustomerRpcInput['payload'],
  ): Promise<UpdateCustomerRpcInput['response']> {
    return this.paymentsService.updateCustomer(payload.customerId, payload.input);
  }

  @MessagePattern(DeleteCustomerRpcInput.pattern)
  deleteCustomer(
    @Payload() payload: DeleteCustomerRpcInput['payload'],
  ): Promise<DeleteCustomerRpcInput['response']> {
    return this.paymentsService.deleteCustomer(payload.customerId);
  }

  @MessagePattern(CreatePaymentRpcInput.pattern)
  createPayment(
    @Payload() payload: CreatePaymentRpcInput['payload'],
  ): Promise<CreatePaymentRpcInput['response']> {
    return this.paymentsService.createPayment(payload.input);
  }

  @MessagePattern(FindOnePaymentRpcInput.pattern)
  findOnePayment(
    @Payload() payload: FindOnePaymentRpcInput['payload'],
  ): Promise<FindOnePaymentRpcInput['response']> {
    return this.paymentsService.findOnePayment(payload.paymentId);
  }

  @MessagePattern(CreateRefundPaymentRpcInput.pattern)
  createRefundPayment(
    @Payload() payload: CreateRefundPaymentRpcInput['payload'],
  ): Promise<CreateRefundPaymentRpcInput['response']> {
    return this.paymentsService.createRefundPayment(payload.input);
  }

  @MessagePattern(FindOneRefundPaymentRpcInput.pattern)
  findOneRefundPayment(
    @Payload() payload: FindOneRefundPaymentRpcInput['payload'],
  ): Promise<FindOneRefundPaymentRpcInput['response']> {
    return this.paymentsService.findOneRefundPayment(payload.refundId);
  }

  @MessagePattern(ProcessWebhookRpcInput.pattern)
  processWebhook(
    @Payload() payload: ProcessWebhookRpcInput['payload'],
  ): Promise<ProcessWebhookRpcInput['response']> {
    return this.paymentsService.processWebhook(payload.input);
  }
}
