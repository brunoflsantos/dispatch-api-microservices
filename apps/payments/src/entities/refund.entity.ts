import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('refunds')
export class Refund extends BaseEntity {
  // paymentId is always used to load refunds belonging to a payment.
  @Index()
  @Column('uuid')
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.refunds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Index({ unique: true })
  @Column()
  gatewayRefundId: string;

  @Column('integer')
  amount: number;
}
