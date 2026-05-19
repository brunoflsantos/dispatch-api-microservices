export interface NotificationResult {
  id: string;

  type: string;

  event: string;

  data?: Record<string, any>;

  read: boolean;

  readAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
