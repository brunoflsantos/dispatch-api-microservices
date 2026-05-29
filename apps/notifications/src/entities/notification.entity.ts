import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('notifications')
// Covers "fetch unread notifications for user" — the most frequent read path.
@Index('IDX_notifications_userId_unread', ['userId'], {
  where: '"read" = false AND "deletedAt" IS NULL',
})
// Supports cursor-based pagination over active notifications per user.
@Index('IDX_notifications_userId_createdAt_id', ['userId', 'createdAt', 'id'], {
  where: '"deletedAt" IS NULL',
})
export class Notification extends BaseEntity {
  @Column('uuid')
  userId: string;

  // Indexed to allow filtering notifications by type (e.g. ORDER, PAYMENT).
  @Index()
  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  event: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: any;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;
}
