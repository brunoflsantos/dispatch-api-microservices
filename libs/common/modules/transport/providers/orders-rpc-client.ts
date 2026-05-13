import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseRpcClient } from 'libs/contracts/providers/base-rpc-client';
import { ORDERS_CLIENT } from '../constants/client-proxies.tokens';
import { BaseOrdersRpcInput } from '../dto/orders-rpc.input';

@Injectable()
export class OrdersRpcClient extends BaseRpcClient<BaseOrdersRpcInput> {
  constructor(@Inject(ORDERS_CLIENT) client: ClientProxy) {
    super(client);
  }
}
