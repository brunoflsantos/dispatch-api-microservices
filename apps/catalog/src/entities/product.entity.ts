import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column('integer')
  stock: number;

  @Column('integer')
  price: number;
}
