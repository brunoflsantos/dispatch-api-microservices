import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { ProductCursorQueryInput } from 'libs/contracts/interfaces/products/product-cursor-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
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
    query: Partial<ProductCursorQueryInput>,
  ): Promise<PagCursorResultDto<Product>> {
    const { name, description, cursor } = query;
    const limit = cursor?.limit ? Math.min(cursor.limit, 100) : 20;

    const queryBuilder = this.createQueryBuilder(ALIAS_PRODUCT)
      .orderBy(product('createdAt'), 'DESC')
      .addOrderBy(product('id'), 'DESC')
      .take(limit + 1);

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
    if (cursor?.startingAfter) {
      queryBuilder.andWhere(`${product('createdAt')} < :startingAfter`, {
        startingAfter: cursor.startingAfter,
      });
    }

    const items = await queryBuilder.getMany();
    const hasMore = items.length > limit;
    const paginatedItems = hasMore ? items.slice(0, limit) : items;
    const lastItem = paginatedItems.at(-1);

    return new PagCursorResultDto(
      paginatedItems,
      hasMore && lastItem ? this.encodeCursor(lastItem) : undefined,
      hasMore,
    );
  }

  private encodeCursor(item: Product): string {
    const cursor: CursorParams = { startingAfter: item.createdAt.toISOString() };
    return Buffer.from(JSON.stringify(cursor)).toString('base64');
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
