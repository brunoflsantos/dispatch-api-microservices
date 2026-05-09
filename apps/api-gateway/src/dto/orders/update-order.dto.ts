import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { UpdateOrderRequestContract } from 'libs/contracts/interfaces/orders/update-order-request.interface';

export class UpdateOrderDto implements UpdateOrderRequestContract {
  @ApiProperty({
    description: 'The new status of the order',
    example: 'shipped',
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
