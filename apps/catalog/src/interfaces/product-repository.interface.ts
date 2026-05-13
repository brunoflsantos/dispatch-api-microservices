import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { ProductQueryInput } from 'libs/contracts/interfaces/products/product-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Product } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  filter(query: Partial<ProductQueryInput>): Promise<PagOffsetResultDto<Product>>;

  findManyByIds(ids: string[]): Promise<Product[]>;

  decrementStock(product: Product, quantity: number): Promise<void>;

  incrementStock(product: Product, quantity: number): Promise<void>;
}
