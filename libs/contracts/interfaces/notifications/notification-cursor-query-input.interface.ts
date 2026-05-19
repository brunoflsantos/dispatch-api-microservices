import { BaseCursorQueryInput } from '../base-cursor-query-input.interface';

export interface NotificationCursorQueryInput extends BaseCursorQueryInput {
  userId: string;

  language: string;
}
