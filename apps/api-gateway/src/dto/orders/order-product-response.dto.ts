import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { OrderProductResult } from 'libs/contracts/interfaces/orders/order-product-result.interface';

@Exclude()
export class OrderProductResponseDto implements OrderProductResult {
  @Expose()
  @ApiProperty({
    description: 'Order product unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Order ID that this product belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  orderId: string;

  @Expose()
  @ApiProperty({
    description: 'Product unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  productId: string;

  @Expose()
  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
  })
  productName: string;

  @Expose()
  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
  })
  productDescription: string;

  @Expose()
  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
  })
  productStock: number;

  @Expose()
  @ApiProperty({
    description: 'Product price in cents',
    example: 14999,
  })
  productPrice: number;
}
