import { ClientProxy } from '@nestjs/microservices';
import { BaseRpcInput } from 'libs/common/modules/transport/dto/base.input';
import { firstValueFrom } from 'rxjs';

export abstract class BaseRpcClient<T extends BaseRpcInput> {
  constructor(private readonly client: ClientProxy) {}

  /**
   * Calls the RPC client with the given input and returns a promise of the response.
   * @param rpcInput The input data for the RPC call.
   * @returns A promise that resolves with the response of the RPC call.
   */
  call<U extends T, V = U['response']>(rpcInput: U): Promise<V> {
    return firstValueFrom(this.client.send(rpcInput.pattern, rpcInput.payload));
  }
}
