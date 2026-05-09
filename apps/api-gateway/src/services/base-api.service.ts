import { ClientProxy } from '@nestjs/microservices';
import { BaseContractMethod } from 'libs/contracts/messaging/base-contract-method';
import { BaseService } from 'libs/contracts/services/base.service';
import { firstValueFrom } from 'rxjs';

export abstract class BaseApiService extends BaseService {
  constructor(
    protected readonly serviceName: string,
    protected readonly client: ClientProxy,
  ) {
    super(serviceName);
  }

  sendMessage<T extends BaseContractMethod, U = T['response']>(
    contractMethod: T,
  ): Promise<U> {
    return firstValueFrom(
      this.client.send(contractMethod.message, contractMethod.payload),
    );
  }
}
