export interface NotificationResponseContract {
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
