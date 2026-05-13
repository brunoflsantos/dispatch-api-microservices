import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderInput } from 'libs/contracts/interfaces/orders/create-order-input.interface';
import { CreateOrderProductDto } from './create-order-product.dto';

export class CreateOrderDto implements CreateOrderInput {
  @ApiProperty({
    description: 'Order products',
    type: [CreateOrderProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
