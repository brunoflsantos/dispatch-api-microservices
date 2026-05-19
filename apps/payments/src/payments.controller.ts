import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateGatewayCustomerRpcInput,
  CreateGatewayPaymentRpcInput,
  CreateGatewayRefundPaymentRpcInput,
  CreatePaymentRpcInput,
  DeleteGatewayCustomerRpcInput,
  FindAllGatewayCustomersRpcInput,
  FindAllPaymentsRpcInput,
  FindOneGatewayCustomerRpcInput,
  FindOneGatewayPaymentRpcInput,
  FindOneGatewayRefundPaymentRpcInput,
  FindOnePaymentRpcInput,
  FindPaymentByOrderIdRpcInput,
  UpdateGatewayCustomerRpcInput,
} from 'libs/common/modules/transport/dto/payments-rpc.input';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //#region Gateway handlers

  @MessagePattern(CreateGatewayCustomerRpcInput.pattern)
  createGatewayCustomer(
    @Payload() payload: CreateGatewayCustomerRpcInput['payload'],
  ): Promise<CreateGatewayCustomerRpcInput['response']> {
    return this.paymentsService.createGatewayCustomer(payload.input);
  }

  @MessagePattern(FindAllGatewayCustomersRpcInput.pattern)
  findAllGatewayCustomers(
    @Payload() payload: FindAllGatewayCustomersRpcInput['payload'],
  ): Promise<FindAllGatewayCustomersRpcInput['response']> {
    return this.paymentsService.findAllGatewayCustomers(payload.cursor);
  }

  @MessagePattern(FindOneGatewayCustomerRpcInput.pattern)
  findOneGatewayCustomer(
    @Payload() payload: FindOneGatewayCustomerRpcInput['payload'],
  ): Promise<FindOneGatewayCustomerRpcInput['response']> {
    return this.paymentsService.findOneGatewayCustomer(payload.customerId);
  }

  @MessagePattern(UpdateGatewayCustomerRpcInput.pattern)
  updateGatewayCustomer(
    @Payload() payload: UpdateGatewayCustomerRpcInput['payload'],
  ): Promise<UpdateGatewayCustomerRpcInput['response']> {
    return this.paymentsService.updateGatewayCustomer(
      payload.customerId,
      payload.input,
    );
  }

  @MessagePattern(DeleteGatewayCustomerRpcInput.pattern)
  deleteGatewayCustomer(
    @Payload() payload: DeleteGatewayCustomerRpcInput['payload'],
  ): Promise<DeleteGatewayCustomerRpcInput['response']> {
    return this.paymentsService.deleteGatewayCustomer(payload.customerId);
  }

  @MessagePattern(CreateGatewayPaymentRpcInput.pattern)
  createGatewayPayment(
    @Payload() payload: CreateGatewayPaymentRpcInput['payload'],
  ): Promise<CreateGatewayPaymentRpcInput['response']> {
    return this.paymentsService.createGatewayPayment(payload.input);
  }

  @MessagePattern(FindOneGatewayPaymentRpcInput.pattern)
  findOneGatewayPayment(
    @Payload() payload: FindOneGatewayPaymentRpcInput['payload'],
  ): Promise<FindOneGatewayPaymentRpcInput['response']> {
    return this.paymentsService.findOneGatewayPayment(payload.paymentId);
  }

  @MessagePattern(CreateGatewayRefundPaymentRpcInput.pattern)
  createGatewayRefundPayment(
    @Payload() payload: CreateGatewayRefundPaymentRpcInput['payload'],
  ): Promise<CreateGatewayRefundPaymentRpcInput['response']> {
    return this.paymentsService.createGatewayRefundPayment(payload.input);
  }

  @MessagePattern(FindOneGatewayRefundPaymentRpcInput.pattern)
  findOneGatewayRefundPayment(
    @Payload() payload: FindOneGatewayRefundPaymentRpcInput['payload'],
  ): Promise<FindOneGatewayRefundPaymentRpcInput['response']> {
    return this.paymentsService.findOneGatewayRefundPayment(payload.refundId);
  }

  //#endregion

  //#region Entity handlers

  @MessagePattern(CreatePaymentRpcInput.pattern)
  createPayment(
    @Payload() payload: CreatePaymentRpcInput['payload'],
  ): Promise<CreatePaymentRpcInput['response']> {
    return this.paymentsService.createPayment(payload.input);
  }

  @MessagePattern(FindAllPaymentsRpcInput.pattern)
  findAllPayments(
    @Payload() payload: FindAllPaymentsRpcInput['payload'],
  ): Promise<FindAllPaymentsRpcInput['response']> {
    return this.paymentsService.findAllPayments(payload.query);
  }

  @MessagePattern(FindOnePaymentRpcInput.pattern)
  findOnePayment(
    @Payload() payload: FindOnePaymentRpcInput['payload'],
  ): Promise<FindOnePaymentRpcInput['response']> {
    return this.paymentsService.findOnePayment(payload.paymentId);
  }

  @MessagePattern(FindPaymentByOrderIdRpcInput.pattern)
  findPaymentByOrderId(
    @Payload() payload: FindPaymentByOrderIdRpcInput['payload'],
  ): Promise<FindPaymentByOrderIdRpcInput['response']> {
    return this.paymentsService.findPaymentByOrderId(payload.orderId);
  }

  //#endregion
}
