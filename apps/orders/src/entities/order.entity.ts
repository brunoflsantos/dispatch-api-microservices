import { OrderStatus } from 'libs/common/enums/order-status.enum';
import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity('orders')
export class Order extends BaseEntity {
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
