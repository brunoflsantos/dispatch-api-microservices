import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { ProductQueryRequestContract } from 'libs/contracts/interfaces/products/product-query-request.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Product } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  filter(
    query: Partial<ProductQueryRequestContract>,
  ): Promise<PagOffsetResultDto<Product>>;

  findManyByIds(ids: string[]): Promise<Product[]>;

  decrementStock(product: Product, quantity: number): Promise<void>;

  incrementStock(product: Product, quantity: number): Promise<void>;
}
