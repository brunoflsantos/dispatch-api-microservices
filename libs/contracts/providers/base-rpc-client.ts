import { ClientProxy } from '@nestjs/microservices';
import { BaseRpcInput } from 'libs/common/modules/transport/dto/base.input';
import { firstValueFrom } from 'rxjs';

export abstract class BaseRpcClient<T extends BaseRpcInput> {
  constructor(private readonly client: ClientProxy) {}

  call<U extends T, V = U['response']>(rpcInput: U): Promise<V> {
    return firstValueFrom(this.client.send(rpcInput.pattern, rpcInput.payload));
  }
}
