import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { BaseOffsetQueryInput } from '../base-offset-query-input.interface';

interface BaseOrderOffsetQueryInput extends BaseOffsetQueryInput {
  status?: OrderStatus;

  startDate?: string;

  endDate?: string;
}

export interface OrderOffsetQueryInput extends BaseOrderOffsetQueryInput {
  userId?: string;
}

export interface OrderByUserOffsetQueryInput extends BaseOrderOffsetQueryInput {}
