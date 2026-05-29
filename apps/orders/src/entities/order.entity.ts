import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity('orders')
// Covers the dominant query "get orders for user X filtered by status".
@Index('IDX_orders_userId_status', ['userId', 'status'])
// Allows looking up an order by its payment ID (e.g. from a webhook event).
@Index('IDX_orders_paymentId', ['paymentId'], { where: '"paymentId" IS NOT NULL' })
export class Order extends BaseEntity {
  @Index()
  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('integer')
  total: number;

  // reserveId ties an order to a stock reservation; queried on confirm/cancel.
  @Index()
  @Column()
  reserveId: string;

  @Column({ nullable: true })
  paymentId?: string;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ nullable: true })
  carrier?: string;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @OneToMany(() => OrderProduct, (op) => op.order, {
    cascade: true,
    eager: true,
  })
  products: OrderProduct[];
}
