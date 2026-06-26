import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { BaseCursorQueryInput } from '../base-cursor-query-input.interface';

interface BaseOrderCursorQueryInput extends BaseCursorQueryInput {
  status?: OrderStatus;

  startDate?: string;

  endDate?: string;
}

export interface OrderCursorQueryInput extends BaseOrderCursorQueryInput {
  userId?: string;
}

export interface OrderByUserCursorQueryInput extends BaseOrderCursorQueryInput {}
