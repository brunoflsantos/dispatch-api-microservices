import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_CLIENT } from '../constants/gateway.tokens';
import { BaseApiService } from './base-api.service';

export class ApiNotificationsService extends BaseApiService {
  constructor(@Inject(NOTIFICATIONS_CLIENT) client: ClientProxy) {
    super(ApiNotificationsService.name, client);
  }
}
