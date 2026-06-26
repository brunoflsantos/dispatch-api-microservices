import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { PaymentCursorQueryInput } from 'libs/contracts/interfaces/payments/payment-cursor-query-input.interface';
import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository extends IBaseRepository<Payment> {
  filter(query: PaymentCursorQueryInput): Promise<PagCursorResultDto<Payment>>;
}
