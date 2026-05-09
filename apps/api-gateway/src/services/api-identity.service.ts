import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IDENTITY_CLIENT } from '../constants/gateway.tokens';
import { BaseApiService } from './base-api.service';

@Injectable()
export class ApiIdentityService extends BaseApiService {
  constructor(@Inject(IDENTITY_CLIENT) client: ClientProxy) {
    super(ApiIdentityService.name, client);
  }
}
