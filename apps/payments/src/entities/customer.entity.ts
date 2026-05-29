import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('customers')
@Index(['userId'], { unique: true })
@Index(['gatewayCustomerId'], { unique: true })
export class Customer extends BaseEntity {
  @Column()
  gatewayCustomerId: string;

  @Column('uuid')
  userId: string;

  @Column()
  email: string;

  @Column()
  name: string;
}
