import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';
import { CreateOrderProductInput } from 'libs/contracts/interfaces/orders/create-order-product-input.interface';

export class CreateOrderProductDto implements CreateOrderProductInput {
  @ApiProperty({
    description: 'Product unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
