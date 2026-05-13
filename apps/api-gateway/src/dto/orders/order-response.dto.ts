import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OrderResult } from 'libs/contracts/interfaces/orders/order-result.interface';
import { OrderProductResponseDto } from './order-product-response.dto';

@Exclude()
export class OrderResponseDto implements OrderResult {
  @Expose()
  @ApiProperty({
    description: 'Order unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Expose()
  @ApiProperty({
    description: 'Order total amount (in cents)',
    example: 29999,
  })
  total: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Order products',
    type: () => [OrderProductResponseDto],
  })
  @Type(() => OrderProductResponseDto)
  products?: OrderProductResponseDto[];

  @Expose()
  @ApiProperty({
    description: 'Payment identifier',
    example: 'pi_123456789',
  })
  paymentId: string;

  @Expose()
  @ApiProperty({
    description: 'Payment status',
    example: 'requires_confirmation',
  })
  paymentStatus: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Client secret used by the frontend to confirm payment',
    example: 'pi_123456789_secret_123456789',
  })
  paymentClientSecret?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Shipping tracking number provided by the carrier',
    example: 'BR123456789',
  })
  trackingNumber?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Carrier name (e.g. Correios, Fedex)',
    example: 'Correios',
  })
  carrier?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date when the order was shipped',
    example: '2024-01-02T10:00:00Z',
  })
  shippedAt?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date when the order was delivered',
    example: '2024-01-05T14:30:00Z',
  })
  deliveredAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-01T12:00:00Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Order last update date',
    example: '2024-01-01T12:00:00Z',
  })
  updatedAt: Date;
}
