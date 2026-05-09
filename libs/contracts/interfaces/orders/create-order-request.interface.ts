import { CreateOrderProductRequestContract } from './create-order-product-request.interface';

export interface CreateOrderRequestContract {
  products: CreateOrderProductRequestContract[];
}
