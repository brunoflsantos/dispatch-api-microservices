import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('refunds')
export class Refund extends BaseEntity {
  @Column('uuid')
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.refunds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column('integer')
  amount: number;

  @Column({ nullable: false })
  reason: string;
}
