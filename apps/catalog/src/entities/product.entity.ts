import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CartProduct } from './cart-product.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column('integer')
  stock: number;

  @Column('integer')
  price: number;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];
}
