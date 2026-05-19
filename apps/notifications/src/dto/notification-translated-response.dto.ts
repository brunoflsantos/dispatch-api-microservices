import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { NotificationTranslatedResult } from 'libs/contracts/interfaces/notifications/notification-translated-result.interface';

@Exclude()
export class NotificationTranslatedResponseDto implements NotificationTranslatedResult {
  @Expose()
  @ApiProperty({
    title: 'Title of the notification',
    example: 'Order Created',
  })
  title: string;

  @Expose()
  @ApiProperty({
    title: 'Message of the notification',
    example: 'Your order #1234 has been created successfully.',
  })
  message: string;

  @Expose()
  @ApiProperty({
    title: 'ID of the notification',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    title: 'Type of the notification',
    example: 'ORDER_CREATED',
  })
  type: string;

  @Expose()
  @ApiProperty({
    title: 'Read status of the notification',
    example: false,
  })
  read: boolean;

  @Expose()
  @ApiProperty({
    title: 'Read timestamp of the notification',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  readAt?: Date;

  @Expose()
  @ApiProperty({
    title: 'Creation timestamp of the notification',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    title: 'Update timestamp of the notification',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
