import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { CartProduct } from '../entities/cart-product.entity';

export interface ICartProductRepository extends IBaseRepository<CartProduct> {}
