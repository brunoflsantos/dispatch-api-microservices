import { BaseCursorQueryInput } from '../base-cursor-query-input.interface';

export interface ProductCursorQueryInput extends BaseCursorQueryInput {
  name?: string;

  description?: string;
}
