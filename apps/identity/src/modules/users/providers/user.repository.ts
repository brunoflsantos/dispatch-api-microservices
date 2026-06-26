import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { UserCursorQueryInput } from 'libs/contracts/interfaces/users/user-cursor-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

const ALIAS_USER = 'user';
const user = col<User>(ALIAS_USER);

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async filter(
    query: Partial<UserCursorQueryInput>,
  ): Promise<PagCursorResultDto<User>> {
    const { name, email, cursor } = query;
    const limit = cursor?.limit ? Math.min(cursor.limit, 100) : 20;

    const queryBuilder = this.createQueryBuilder(ALIAS_USER)
      .orderBy(user('createdAt'), 'DESC')
      .addOrderBy(user('id'), 'DESC')
      .take(limit + 1);

    if (name) {
      queryBuilder.andWhere(`${user('name')} ILIKE :name`, {
        name: `%${name}%`,
      });
    }
    if (email) {
      queryBuilder.andWhere(`${user('email')} ILIKE :email`, {
        email: `%${email}%`,
      });
    }
    if (cursor?.startingAfter) {
      queryBuilder.andWhere(`${user('createdAt')} < :startingAfter`, {
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

  private encodeCursor(item: User): string {
    const cursor: CursorParams = { startingAfter: item.createdAt.toISOString() };
    return Buffer.from(JSON.stringify(cursor)).toString('base64');
  }
}
