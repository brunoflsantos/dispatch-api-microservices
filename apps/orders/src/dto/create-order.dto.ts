import { CreateOrderInput } from 'libs/contracts/interfaces/orders/create-order-input.interface';
import { CreateOrderProductDto } from './create-order-product.dto';

export class CreateOrderDto implements CreateOrderInput {
  reserveId: string;

  products: CreateOrderProductDto[];
}
