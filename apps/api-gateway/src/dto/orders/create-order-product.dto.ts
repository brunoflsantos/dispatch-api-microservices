import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { CreateOrderProductRequestContract } from 'libs/contracts/interfaces/orders/create-order-product-request.interface';

export class CreateOrderProductDto implements CreateOrderProductRequestContract {
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
