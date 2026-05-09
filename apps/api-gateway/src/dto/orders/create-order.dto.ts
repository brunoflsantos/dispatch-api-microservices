import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderProductDto } from './create-order-product.dto';
import { CreateOrderRequestContract } from 'libs/contracts/interfaces/orders/create-order-request.interface';

export class CreateOrderDto implements CreateOrderRequestContract {
  @ApiProperty({
    description: 'Order products',
    type: [CreateOrderProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
