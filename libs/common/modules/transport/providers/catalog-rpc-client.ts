import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseCatalogRpcInput } from 'libs/common/modules/transport/dto/catalog-rpc.input';
import { BaseRpcClient } from 'libs/contracts/providers/base-rpc-client';
import { CATALOG_CLIENT } from '../constants/client-proxies.tokens';

@Injectable()
export class CatalogRpcClient extends BaseRpcClient<BaseCatalogRpcInput> {
  constructor(@Inject(CATALOG_CLIENT) client: ClientProxy) {
    super(client);
  }
}
