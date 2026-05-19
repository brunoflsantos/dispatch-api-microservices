import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Refund } from './refund.entity';

@Entity('payments')
@Index(['orderId'], { unique: true })
export class Payment extends BaseEntity {
  @Column('uuid')
  orderId: string;

  @Column('uuid')
  userId: string;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  stripeClientSecret: string;

  @Column()
  status: string;

  @OneToMany(() => Refund, (refund) => refund.payment)
  refunds: Refund[];
}
