import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CATALOG_CLIENT } from '../constants/gateway.tokens';
import { BaseApiService } from './base-api.service';

@Injectable()
export class ApiCatalogService extends BaseApiService {
  constructor(@Inject(CATALOG_CLIENT) client: ClientProxy) {
    super(ApiCatalogService.name, client);
  }
}
