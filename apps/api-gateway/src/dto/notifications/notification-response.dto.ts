import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { NotificationResponseContract } from 'libs/contracts/interfaces/notifications/notification-response.interface';

@Exclude()
export class NotificationResponseDto implements NotificationResponseContract {
  @Expose()
  @ApiProperty({
    description: 'Notification unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Notification type',
    example: 'INFO',
  })
  type: string;

  @Expose()
  @ApiProperty({
    description: 'Notification title',
    example: 'New Message',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Notification message',
    example: 'You have a new message',
  })
  message: string;

  @Expose()
  @ApiProperty({
    description: 'Additional data',
    example: { key: 'value' },
    type: Object,
  })
  data?: Record<string, any>;

  @Expose()
  @ApiProperty({
    description: 'Indicates if the notification has been read',
    example: false,
  })
  read: boolean;

  @Expose()
  @ApiProperty({
    description: 'Date and time when the notification was read',
    example: '2024-06-01T12:00:00Z',
    type: String,
  })
  readAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'Date and time when the notification was created',
    example: '2024-06-01T12:00:00Z',
    type: String,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Date and time when the notification was last updated',
    example: '2024-06-01T12:00:00Z',
    type: String,
  })
  updatedAt: Date;
}
