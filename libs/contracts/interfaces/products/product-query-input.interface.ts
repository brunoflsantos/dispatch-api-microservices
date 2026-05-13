import { OffsetQueryInput } from '../offset-query-input.interface';

export interface ProductQueryInput extends OffsetQueryInput {
  name?: string;

  description?: string;
}
