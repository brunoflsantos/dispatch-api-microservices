import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { UpdateOrderPaymentInput } from 'libs/contracts/interfaces/orders/update-order-payment-input.interface';

export class UpdateOrderPaymentDto implements UpdateOrderPaymentInput {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'The unique identifier of the payment',
    example: 'pi_123456789',
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    description: 'The new status of the payment',
    example: 'succeeded',
  })
  @IsString()
  paymentStatus: string;
}
