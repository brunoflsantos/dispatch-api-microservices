import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { UserQueryRequestContract } from 'libs/contracts/interfaces/users/update-user-query-request.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  filter(
    query: Partial<UserQueryRequestContract>,
  ): Promise<PagOffsetResultDto<User>>;
}
