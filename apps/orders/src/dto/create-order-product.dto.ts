import { CreateOrderProductInput } from 'libs/contracts/interfaces/orders/create-order-product-input.interface';

export class CreateOrderProductDto implements CreateOrderProductInput {
  productId: string;

  quantity: number;
}
