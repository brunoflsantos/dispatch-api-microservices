import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { ProductOffsetQueryInput } from 'libs/contracts/interfaces/products/product-offset-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IProductRepository } from '../interfaces/product-repository.interface';

const ALIAS_PRODUCT = 'product';
const product = col<Product>(ALIAS_PRODUCT);

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(@InjectRepository(Product) repository: Repository<Product>) {
    super(repository);
  }

  async filter(
    query: Partial<ProductOffsetQueryInput>,
  ): Promise<PagOffsetResultDto<Product>> {
    const { name, description, page, limit } = query;

    const queryBuilder = this.createQueryBuilder(ALIAS_PRODUCT);
    if (name) {
      queryBuilder.andWhere(`${product('name')} ILIKE :name`, {
        name: `%${name}%`,
      });
    }
    if (description) {
      queryBuilder.andWhere(`${product('description')} ILIKE :description`, {
        description: `%${description}%`,
      });
    }

    const pageLimit = limit ? Math.min(limit, 100) : 20;
    const skip = page ? (page - 1) * pageLimit : 0;

    return queryBuilder
      .skip(skip)
      .take(pageLimit)
      .orderBy(product('createdAt'), 'DESC')
      .getManyAndCount()
      .then(
        ([data, total]) => new PagOffsetResultDto(total, page || 1, pageLimit, data),
      );
  }

  async increment(id: string, field: keyof Product, value: number): Promise<void> {
    await this.repository.increment({ id }, field, value);
  }

  async decrement(id: string, field: keyof Product, value: number): Promise<void> {
    await this.repository.decrement({ id }, field, value);
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.repository.findBy({ id: In(ids) });
  }
}
