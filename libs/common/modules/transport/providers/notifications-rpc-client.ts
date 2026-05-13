import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_CLIENT } from 'libs/common/modules/transport/constants/client-proxies.tokens';
import { BaseNotificationsRpcInput } from 'libs/common/modules/transport/dto/notifications-rpc.input';
import { BaseRpcClient } from 'libs/contracts/providers/base-rpc-client';

@Injectable()
export class NotificationsRpcClient extends BaseRpcClient<BaseNotificationsRpcInput> {
  constructor(@Inject(NOTIFICATIONS_CLIENT) client: ClientProxy) {
    super(client);
  }
}
