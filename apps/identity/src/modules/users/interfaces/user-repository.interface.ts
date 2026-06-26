import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { UserCursorQueryInput } from 'libs/contracts/interfaces/users/user-cursor-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  filter(query: Partial<UserCursorQueryInput>): Promise<PagCursorResultDto<User>>;
}
