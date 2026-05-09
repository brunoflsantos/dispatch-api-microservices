import { BaseQueryRequestContract } from '../base-query-request.interface';

export interface ProductQueryRequestContract extends BaseQueryRequestContract {
  name?: string;

  description?: string;
}
