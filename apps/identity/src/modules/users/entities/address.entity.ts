import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Index()
  @Column('uuid')
  userId: string;

  @Column({ nullable: false })
  line1: string;

  @Column({ nullable: true })
  line2?: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: false })
  country: string;

  @Column({ nullable: false })
  postalCode: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
