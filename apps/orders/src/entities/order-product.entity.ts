import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_product')
export class OrderProduct extends BaseEntity {
  @Column('uuid')
  orderId: string;

  @ManyToOne(() => Order, (order) => order.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('integer')
  quantity: number;

  @Column('uuid')
  productId: string;

  @Column({ nullable: false })
  productName: string;

  @Column({ type: 'text', nullable: false })
  productDescription: string;

  @Column('integer')
  productStock: number;

  @Column('integer')
  productPrice: number;
}
