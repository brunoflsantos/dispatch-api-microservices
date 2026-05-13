import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OffsetQueryInput } from '../offset-query-input.interface';

interface BaseOrderQueryInput extends OffsetQueryInput {
  status?: OrderStatus;

  startDate?: string;

  endDate?: string;
}

export interface OrderQueryInput extends BaseOrderQueryInput {
  userId?: string;
}

export interface OrderByUserQueryInput extends BaseOrderQueryInput {}
