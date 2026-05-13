import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IDENTITY_CLIENT } from 'libs/common/modules/transport/constants/client-proxies.tokens';
import { BaseIdentityRpcInput } from 'libs/common/modules/transport/dto/identity-rpc.input';
import { BaseRpcClient } from 'libs/contracts/providers/base-rpc-client';

@Injectable()
export class IdentityRpcClient extends BaseRpcClient<BaseIdentityRpcInput> {
  constructor(@Inject(IDENTITY_CLIENT) client: ClientProxy) {
    super(client);
  }
}
