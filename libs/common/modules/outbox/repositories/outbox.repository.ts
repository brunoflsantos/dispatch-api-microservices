import { col } from '@/shared/utils/functions.utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Outbox } from 'libs/common/entities/outbox.entity';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { IOutboxRepository } from '../interfaces/outbox-repository.interface';

const outboxAlias = 'outbox';
const outbox = col<Outbox>(outboxAlias);

@Injectable()
export class OutboxRepository
  extends BaseRepository<Outbox>
  implements IOutboxRepository
{
  constructor(
    @InjectRepository(Outbox)
    protected readonly repository: Repository<Outbox>,
  ) {
    super(repository);
  }

  async findAndLockBatch(limit = 50): Promise<Outbox[]> {
    return this.createQueryBuilder(outboxAlias)
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked') // Skip locked rows to prevent blocking other transactions
      .orderBy(outbox('createdAt'), 'ASC')
      .limit(limit)
      .getMany();
  }
}
