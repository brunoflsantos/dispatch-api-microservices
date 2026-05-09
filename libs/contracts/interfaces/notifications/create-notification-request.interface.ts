export interface CreateNotificationRequestContract {
  userId: string;

  type: string;

  title: string;

  message: string;

  data?: Record<string, any>;
}
