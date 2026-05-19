import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Refund } from '../entities/refund.entity';

export interface IRefundRepository extends IBaseRepository<Refund> {}
