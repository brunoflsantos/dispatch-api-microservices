import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { In, Repository } from 'typeorm';
import { ProductQueryDto } from '../../../api-gateway/src/dto/catalog/product-query.dto';
import { Product } from '../entities/product.entity';
import { IProductRepository } from '../interfaces/product-repository.interface';

const ALIAS_PRODUCT = 'product';
const product = col<Product>(ALIAS_PRODUCT);

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(
    @InjectRepository(Product)
    protected readonly repository: Repository<Product>,
  ) {
    super(repository);
  }

  async filter(
    query: Partial<ProductQueryDto>,
  ): Promise<PagOffsetResultDto<Product>> {
    const queryBuilder = this.createQueryBuilder(ALIAS_PRODUCT);

    if (query.name) {
      queryBuilder.andWhere(`${product('name')} ILIKE :name`, {
        name: `%${query.name}%`,
      });
    }
    if (query.description) {
      queryBuilder.andWhere(`${product('description')} ILIKE :description`, {
        description: `%${query.description}%`,
      });
    }

    const limit = query.limit ? Math.min(query.limit, 100) : 20;
    const skip = (query.page - 1) * limit;

    return queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(product('createdAt'), 'DESC')
      .getManyAndCount()
      .then(
        ([data, total]) => new PagOffsetResultDto(total, query.page, limit, data),
      );
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.repository.findBy({ id: In(ids) });
  }

  async decrementStock(product: Product, quantity: number): Promise<void> {
    const manager = this.getManager();
    await manager.decrement(Product, { id: product.id }, 'stock', quantity);
  }

  async incrementStock(product: Product, quantity: number): Promise<void> {
    const manager = this.getManager();
    await manager.increment(Product, { id: product.id }, 'stock', quantity);
  }
}
