import { NotificationResult } from 'libs/contracts/interfaces/notifications/notification-result.interface';

export class NotificationResponseDto implements NotificationResult {
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
