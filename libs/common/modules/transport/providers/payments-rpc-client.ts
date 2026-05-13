import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseRpcClient } from 'libs/contracts/providers/base-rpc-client';
import { PAYMENTS_CLIENT } from '../constants/client-proxies.tokens';
import { BasePaymentsRpcInput } from '../dto/payments-rpc.input';

@Injectable()
export class PaymentsRpcClient extends BaseRpcClient<BasePaymentsRpcInput> {
  constructor(@Inject(PAYMENTS_CLIENT) client: ClientProxy) {
    super(client);
  }
}
