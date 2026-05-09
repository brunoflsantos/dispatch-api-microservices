import { NotificationResponseContract } from 'libs/contracts/interfaces/notifications/notification-response.interface';

export class NotificationResponseDto implements NotificationResponseContract {
  id: string;

  type: string;

  title: string;

  message: string;

  data?: Record<string, any>;

  read: boolean;

  readAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
