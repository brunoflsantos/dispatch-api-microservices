import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { ProductOffsetQueryInput } from 'libs/contracts/interfaces/products/product-offset-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Product } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  filter(
    query: Partial<ProductOffsetQueryInput>,
  ): Promise<PagOffsetResultDto<Product>>;

  findManyByIds(ids: string[]): Promise<Product[]>;

  increment(id: string, field: keyof Product, value: number): Promise<void>;

  decrement(id: string, field: keyof Product, value: number): Promise<void>;
}
