import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_products')
export class OrderProduct extends BaseEntity {
  // orderId is the primary FK lookup: "which products are in order X".
  @Index()
  @Column('uuid')
  orderId: string;

  @ManyToOne(() => Order, (order) => order.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('integer')
  quantity: number;

  // productId enables reporting queries such as "top-selling products".
  @Index()
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
