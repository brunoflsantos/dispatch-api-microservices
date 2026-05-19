import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('customers')
@Index(['userId'], { unique: true })
@Index(['customerId'], { unique: true })
export class Customer extends BaseEntity {
  @Column()
  customerId: string;

  @Column('uuid')
  userId: string;

  @Column()
  email: string;

  @Column()
  name: string;
}
