import { OrderProductResult } from 'libs/contracts/interfaces/orders/order-product-result.interface';

export class OrderProductResponseDto implements OrderProductResult {
  id: string;

  orderId: string;

  productId: string;

  quantity: number;

  productName: string;

  productDescription: string;

  productStock: number;

  productPrice: number;
}
