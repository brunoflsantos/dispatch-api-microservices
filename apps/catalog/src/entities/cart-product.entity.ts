import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CartProductStatus } from '../enums/cart-product-status.enum';
import { Product } from './product.entity';

// Composite index for the most common query: "pending items for user X".
@Entity('cart_products')
@Index('IDX_cart_products_userId_status', ['userId', 'status'])
export class CartProduct extends BaseEntity {
  @Index()
  @Column('uuid')
  userId: string;

  @Index()
  @Column('uuid')
  productId: string;

  // reserveId is queried on reservation confirmation / cancellation.
  @Index()
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
