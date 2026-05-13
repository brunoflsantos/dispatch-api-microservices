import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { UpdateOrderInput } from 'libs/contracts/interfaces/orders/update-order-input.interface';

export class UpdateOrderDto implements UpdateOrderInput {
  @ApiProperty({
    description: 'The new status of the order',
    example: 'shipped',
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
