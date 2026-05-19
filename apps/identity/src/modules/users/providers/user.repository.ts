import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { UserOffsetQueryInput } from 'libs/contracts/interfaces/users/user-offset-query-input.interface';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
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
    query: Partial<UserOffsetQueryInput>,
  ): Promise<PagOffsetResultDto<User>> {
    const { name, email, page, limit } = query;

    const queryBuilder = this.createQueryBuilder(ALIAS_USER);

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

    // Apply pagination
    const pageLimit = limit ? Math.min(limit, 100) : 20;
    const skip = page ? (page - 1) * pageLimit : 0;

    return queryBuilder
      .skip(skip)
      .take(pageLimit)
      .orderBy(user('createdAt'), 'DESC')
      .getManyAndCount()
      .then(
        ([data, total]) =>
          new PagOffsetResultDto(total, query.page || 1, pageLimit, data),
      );
  }
}
