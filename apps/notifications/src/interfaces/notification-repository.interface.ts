import { CursorParams } from 'libs/contracts/dto/cursor-query.dto';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Notification } from '../entities/notification.entity';

export interface INotificationRepository extends IBaseRepository<Notification> {
  filterByUser(
    userId: string,
    cursor?: CursorParams,
    limit?: number,
  ): Promise<PagCursorResultDto<Notification>>;
}
