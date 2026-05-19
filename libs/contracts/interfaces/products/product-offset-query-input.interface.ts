import { BaseOffsetQueryInput } from '../base-offset-query-input.interface';

export interface ProductOffsetQueryInput extends BaseOffsetQueryInput {
  name?: string;

  description?: string;
}
