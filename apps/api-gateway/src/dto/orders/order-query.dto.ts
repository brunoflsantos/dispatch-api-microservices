import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { OffsetQueryDto } from 'libs/contracts/dto/base-query.dto';
import {
  OrderByUserQueryInput,
  OrderQueryInput,
} from 'libs/contracts/interfaces/orders/order-query-input.interface';

export class OrderQueryDto extends OffsetQueryDto implements OrderQueryInput {
  @ApiPropertyOptional({
    description: 'User ID to filter orders',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Order status to filter',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Start date for filtering (ISO string)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (ISO string)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class OrderByUserQueryDto
  extends OmitType(OrderQueryDto, ['userId'] as const)
  implements OrderByUserQueryInput {}
