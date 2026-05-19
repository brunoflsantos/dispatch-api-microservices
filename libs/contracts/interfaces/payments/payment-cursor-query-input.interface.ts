import { BaseCursorQueryInput } from '../base-cursor-query-input.interface';

export interface PaymentCursorQueryInput extends BaseCursorQueryInput {
  userId?: string;

  orderId?: string;
}
