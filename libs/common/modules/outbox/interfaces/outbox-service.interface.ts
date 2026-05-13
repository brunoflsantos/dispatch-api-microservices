import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { BaseEventInput } from '../../transport/dto/base.input';

export interface IOutboxService extends IBaseService {
  add<T extends BaseEventInput>(outboxPayload: T): Promise<void>;
}
