import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CountUnreadNotificationsRpcInput,
  FindByUserNotificationsRpcInput,
  HasNewNotificationsRpcInput,
  MarkNotificationAsReadRpcInput,
} from 'libs/common/modules/transport/dto/notifications-rpc.input';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { NOTIFICATIONS_SERVICE } from './constants/notifications.token';
import type { INotificationsService } from './interfaces/notifications-service.interface';

@Controller()
export class NotificationsController extends BaseController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: INotificationsService,
  ) {
    super(NotificationsController.name);
  }

  @MessagePattern(FindByUserNotificationsRpcInput.pattern)
  findByUser(
    @Payload() payload: FindByUserNotificationsRpcInput['payload'],
  ): Promise<FindByUserNotificationsRpcInput['response']> {
    return this.notificationsService.findByUser(payload.user.id, payload.cursor);
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
}
