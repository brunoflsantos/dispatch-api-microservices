import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  ProductResponseContract,
  PublicProductResponseContract,
} from 'libs/contracts/interfaces/products/product-response.interface';

@Exclude()
export class ProductResponseDto implements ProductResponseContract {
  @Expose()
  @ApiProperty({
    description: 'Product unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

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
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
  })
  stock: number;

  @Expose()
  @ApiProperty({
    description: 'Product price in cents',
    example: 14999,
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'Product creation date',
    example: '2024-01-01T12:00:00Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Product last update date',
    example: '2024-01-01T12:00:00Z',
  })
  updatedAt: Date;
}

export class PublicProductResponseDto
  extends OmitType(ProductResponseDto, ['createdAt', 'updatedAt'] as const)
  implements PublicProductResponseContract {}
