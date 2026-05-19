import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { CartProduct } from '../entities/cart-product.entity';
import { ICartProductRepository } from '../interfaces/cart-product-repository.interface';

export class CartProductRepository
  extends BaseRepository<CartProduct>
  implements ICartProductRepository
{
  constructor(@InjectRepository(CartProduct) repository: Repository<CartProduct>) {
    super(repository);
  }
}
