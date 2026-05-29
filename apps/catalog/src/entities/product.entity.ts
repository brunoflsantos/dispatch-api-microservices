import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { CartProduct } from './cart-product.entity';

// Partial index covering only available products — the dominant query path.
@Entity('products')
@Index('IDX_products_stock_available', ['stock'], { where: '"stock" > 0' })
export class Product extends BaseEntity {
  @Index()
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column('integer')
  stock: number;

  @Index()
  @Column('integer')
  price: number;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];
}
