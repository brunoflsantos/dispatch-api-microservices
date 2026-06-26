import { Outbox } from 'libs/common/entities/outbox.entity';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';

export interface IOutboxRepository extends IBaseRepository<Outbox> {
  findAndLockBatch(limit?: number): Promise<Outbox[]>;
}
