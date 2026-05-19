import { NotificationResult } from './notification-result.interface';

export interface NotificationTranslatedResult extends Omit<
  NotificationResult,
  'data' | 'event'
> {
  title: string;

  message: string;
}
