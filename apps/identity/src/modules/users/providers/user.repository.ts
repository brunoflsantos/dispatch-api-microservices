import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { col } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { UserQueryRequestInput } from 'libs/contracts/interfaces/users/update-user-query-input.interface';
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
    query: Partial<UserQueryRequestInput>,
  ): Promise<PagOffsetResultDto<User>> {
    const queryBuilder = this.createQueryBuilder(ALIAS_USER);

    if (query.name) {
      queryBuilder.andWhere(`${user('name')} ILIKE :name`, {
        name: `%${query.name}%`,
      });
    }
    if (query.email) {
      queryBuilder.andWhere(`${user('email')} ILIKE :email`, {
        email: `%${query.email}%`,
      });
    }

    // Apply pagination
    const limit = query.limit ? Math.min(query.limit, 100) : 20;
    const skip = query.page ? (query.page - 1) * limit : 0;

    return queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(user('createdAt'), 'DESC')
      .getManyAndCount()
      .then(
        ([data, total]) =>
          new PagOffsetResultDto(total, query.page || 1, limit, data),
      );
  }
}
