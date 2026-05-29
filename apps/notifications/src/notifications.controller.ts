import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CountUnreadNotificationsRpcInput,
  FindByUserNotificationsRpcInput,
  HasNewNotificationsRpcInput,
  MarkNotificationAsReadRpcInput,
} from 'libs/common/modules/transport/dto/notifications-rpc.input';
import {
  OrderCanceledEventInput,
  OrderCreatedEventInput,
  OrderDeliveredEventInput,
  OrderFailedEventInput,
  OrderFailedUponCreatingEventInput,
  OrderRefundedEventInput,
  OrderShippedEventInput,
  OrderStatusChangedEventInput,
} from 'libs/common/modules/transport/dto/orders-event.input';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { NOTIFICATIONS_SERVICE } from './constants/notifications.token';
import { NotificationEvent } from './enums/notification-event.enum';
import { NotificationType } from './enums/notification-type.enum';
import type { INotificationsService } from './interfaces/notifications-service.interface';

@Controller()
export class NotificationsController extends BaseController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: INotificationsService,
  ) {
    super(NotificationsController.name);
  }

  //#region Notifications - RPC

  @MessagePattern(FindByUserNotificationsRpcInput.pattern)
  findByUser(
    @Payload() payload: FindByUserNotificationsRpcInput['payload'],
  ): Promise<FindByUserNotificationsRpcInput['response']> {
    return this.notificationsService.findByUser(payload.query);
  }

  @MessagePattern(MarkNotificationAsReadRpcInput.pattern)
  async markAsRead(
    @Payload() payload: MarkNotificationAsReadRpcInput['payload'],
  ): Promise<MarkNotificationAsReadRpcInput['response']> {
    await this.notificationsService.markAsRead(payload.id, payload.userId);
  }

  @MessagePattern(CountUnreadNotificationsRpcInput.pattern)
  countUnread(
    @Payload() payload: CountUnreadNotificationsRpcInput['payload'],
  ): Promise<CountUnreadNotificationsRpcInput['response']> {
    return this.notificationsService.countUnread(payload.userId);
  }

  @MessagePattern(HasNewNotificationsRpcInput.pattern)
  hasNewNotifications(
    @Payload() payload: HasNewNotificationsRpcInput['payload'],
  ): Promise<HasNewNotificationsRpcInput['response']> {
    return this.notificationsService.hasNewNotifications(payload.userId);
  }

  //#endregion

  //#region Notifications - Events

  @EventPattern(OrderCreatedEventInput.pattern)
  async eventOrderCreated(
    @Payload() payload: OrderCreatedEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_CREATED,
      data: payload,
    });
  }

  @EventPattern(OrderFailedUponCreatingEventInput.pattern)
  async eventOrderFailedUponCreating(
    @Payload() payload: OrderFailedUponCreatingEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_FAILED_UPON_CREATING,
      data: payload,
    });
  }

  @EventPattern(OrderStatusChangedEventInput.pattern)
  async eventOrderStatusChanged(
    @Payload() payload: OrderStatusChangedEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_STATUS_CHANGED,
      data: payload,
    });
  }

  @EventPattern(OrderCanceledEventInput.pattern)
  async eventOrderCanceled(
    @Payload() payload: OrderCanceledEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_CANCELED,
      data: payload,
    });
  }

  @EventPattern(OrderRefundedEventInput.pattern)
  async eventOrderRefunded(
    @Payload() payload: OrderRefundedEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_REFUNDED,
      data: payload,
    });
  }

  @EventPattern(OrderShippedEventInput.pattern)
  async eventOrderShipped(
    @Payload() payload: OrderShippedEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_SHIPPED,
      data: payload,
    });
  }

  @EventPattern(OrderDeliveredEventInput.pattern)
  async eventOrderDelivered(
    @Payload() payload: OrderDeliveredEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_DELIVERED,
      data: payload,
    });
  }

  @EventPattern(OrderFailedEventInput.pattern)
  async eventOrderFailed(
    @Payload() payload: OrderFailedEventInput['payload'],
  ): Promise<void> {
    await this.notificationsService.create({
      userId: payload.userId,
      type: NotificationType.PUSH,
      event: NotificationEvent.ORDER_FAILED,
      data: payload,
    });
  }

  //#endregion
}
