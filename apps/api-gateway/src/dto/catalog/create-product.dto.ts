import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateProductRequestContract } from 'libs/contracts/interfaces/products/create-product-request.interface';

export class CreateProductDto implements CreateProductRequestContract {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Product price in cents',
    example: 14999,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  price: number;
}
