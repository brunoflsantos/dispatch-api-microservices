import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { UserOffsetQueryInput } from 'libs/contracts/interfaces/users/user-offset-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  filter(query: Partial<UserOffsetQueryInput>): Promise<PagOffsetResultDto<User>>;
}
