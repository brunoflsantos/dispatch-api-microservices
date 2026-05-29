import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Refund } from './refund.entity';

@Entity('payments')
// Each order can have at most one payment.
@Index('IDX_payments_orderId', ['orderId'], { unique: true })
export class Payment extends BaseEntity {
  @Column('uuid')
  orderId: string;

  // Indexed to support queries like "all payments for user X".
  @Index()
  @Column('uuid')
  userId: string;

  // Stripe sends the paymentIntentId in webhook events; must be fast to look up.
  @Index({ unique: true })
  @Column()
  stripePaymentIntentId: string;

  @Column()
  stripeClientSecret: string;

  @Column()
  status: string;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];
}
