import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  UserCreatedEventInput,
  UserDeletedEventInput,
  UserUpdatedEventInput,
} from 'libs/common/modules/transport/dto/identity-event.input';
import { OrderRefundedEventInput } from 'libs/common/modules/transport/dto/orders-event.input';
import {
  CreatePaymentRpcInput,
  FindAllPaymentsRpcInput,
  FindOnePaymentRpcInput,
  FindPaymentByOrderIdRpcInput,
} from 'libs/common/modules/transport/dto/payments-rpc.input';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //#region RPC

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

  //#region Events

  @EventPattern(UserCreatedEventInput.pattern)
  async eventUserCreated(
    @Payload() payload: UserCreatedEventInput['payload'],
  ): Promise<void> {
    await this.paymentsService.createCustomer(
      {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      },
      payload.idempotencyKey,
    );
  }

  @EventPattern(UserUpdatedEventInput.pattern)
  async eventUserUpdated(
    @Payload() payload: UserUpdatedEventInput['payload'],
  ): Promise<void> {
    await this.paymentsService.updateCustomer({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    });
  }

  @EventPattern(UserDeletedEventInput.pattern)
  async eventUserDeleted(
    @Payload() payload: UserDeletedEventInput['payload'],
  ): Promise<void> {
    await this.paymentsService.deleteCustomer(payload.userId);
  }

  @EventPattern(OrderRefundedEventInput.pattern)
  async eventOrderRefunded(
    @Payload() payload: OrderRefundedEventInput['payload'],
  ): Promise<void> {
    await this.paymentsService.createRefund(
      {
        orderId: payload.orderId,
        amount: payload.refundAmount,
      },
      payload.idempotencyKey,
    );
  }

  //#endregion
}
