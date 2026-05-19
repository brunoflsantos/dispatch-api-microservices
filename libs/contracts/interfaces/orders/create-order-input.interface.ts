import { CreateOrderProductInput } from './create-order-product-input.interface';

export interface CreateOrderInput {
  reserveId: string;

  products: CreateOrderProductInput[];
}
