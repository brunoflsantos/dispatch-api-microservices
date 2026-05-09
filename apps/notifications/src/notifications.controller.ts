import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import {
  CountUnreadNotificationsContractMethod,
  FindByUserNotificationsContractMethod,
  HasNewNotificationsContractMethod,
  MarkNotificationAsReadContractMethod,
} from 'libs/contracts/messaging/notifications-contracts';
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

  @MessagePattern(FindByUserNotificationsContractMethod.message)
  findByUser(
    @Payload() data: typeof FindByUserNotificationsContractMethod.prototype.payload,
  ): Promise<typeof FindByUserNotificationsContractMethod.prototype.response> {
    return this.notificationsService.findByUser(data.user.id, data.cursor);
  }

  @MessagePattern(MarkNotificationAsReadContractMethod.message)
  async markAsRead(
    @Payload() data: typeof MarkNotificationAsReadContractMethod.prototype.payload,
  ): Promise<typeof MarkNotificationAsReadContractMethod.prototype.response> {
    await this.notificationsService.markAsRead(data.id, data.userId);
  }

  @MessagePattern(CountUnreadNotificationsContractMethod.message)
  countUnread(
    @Payload() data: typeof CountUnreadNotificationsContractMethod.prototype.payload,
  ): Promise<typeof CountUnreadNotificationsContractMethod.prototype.response> {
    return this.notificationsService.countUnread(data.userId);
  }

  @MessagePattern(HasNewNotificationsContractMethod.message)
  hasNewNotifications(
    @Payload() data: typeof HasNewNotificationsContractMethod.prototype.payload,
  ): Promise<typeof HasNewNotificationsContractMethod.prototype.response> {
    return this.notificationsService.hasNewNotifications(data.userId);
  }
}
