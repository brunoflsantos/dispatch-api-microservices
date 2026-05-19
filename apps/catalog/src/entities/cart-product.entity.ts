import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartProductStatus } from '../enums/cart-product-status.enum';
import { Product } from './product.entity';

@Entity('cart_products')
export class CartProduct extends BaseEntity {
  @Column('uuid')
  userId: string;

  @Column('uuid')
  productId: string;

  @Column()
  reserveId: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: CartProductStatus,
    default: CartProductStatus.PENDING,
  })
  status: CartProductStatus;

  @ManyToOne(() => Product, (product) => product.cartProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
