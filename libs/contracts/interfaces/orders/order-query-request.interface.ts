import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { BaseQueryRequestContract } from '../base-query-request.interface';

interface BaseOrderQueryRequestContract extends BaseQueryRequestContract {
  status?: OrderStatus;

  startDate?: string;

  endDate?: string;
}

export interface OrderQueryRequestContract extends BaseOrderQueryRequestContract {
  userId?: string;
}

export interface OrderByUserQueryRequestContract extends BaseOrderQueryRequestContract {}
