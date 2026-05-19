import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { Refund } from '../entities/refund.entity';
import { IRefundRepository } from '../interfaces/refund-repository.interface';

@Injectable()
export class RefundRepository
  extends BaseRepository<Refund>
  implements IRefundRepository
{
  constructor(@InjectRepository(Refund) repository: Repository<Refund>) {
    super(repository);
  }
}
