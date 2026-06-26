import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { ProductCursorQueryInput } from 'libs/contracts/interfaces/products/product-cursor-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Product } from '../entities/product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  filter(
    query: Partial<ProductCursorQueryInput>,
  ): Promise<PagCursorResultDto<Product>>;

  findManyByIds(ids: string[]): Promise<Product[]>;

  increment(id: string, field: keyof Product, value: number): Promise<void>;

  decrement(id: string, field: keyof Product, value: number): Promise<void>;
}
