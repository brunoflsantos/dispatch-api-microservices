import { CursorQueryDto } from 'libs/contracts/dto/cursor-query.dto';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository extends IBaseRepository<Payment> {
  filter(params: {
    userId?: string;
    orderId?: string;
    cursor?: CursorQueryDto;
  }): Promise<PagCursorResultDto<Payment>>;
}
