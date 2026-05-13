import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { UserQueryRequestInput } from 'libs/contracts/interfaces/users/update-user-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  filter(query: Partial<UserQueryRequestInput>): Promise<PagOffsetResultDto<User>>;
}
