import { Module } from '@nestjs/common';
import { rmqRpcBrokerConfig } from 'libs/common/config/transport.config';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import {
  CATALOG_CLIENT,
  IDENTITY_CLIENT,
  NOTIFICATIONS_CLIENT,
  ORDERS_CLIENT,
  PAYMENTS_CLIENT,
} from 'libs/common/modules/transport/constants/client-proxies.tokens';
import {
  CATALOG_RPC_QUEUE,
  IDENTITY_RPC_QUEUE,
  NOTIFICATIONS_RPC_QUEUE,
  ORDERS_RPC_QUEUE,
  PAYMENTS_RPC_QUEUE,
} from 'libs/common/modules/transport/constants/queues.token';
import { CatalogRpcClient } from './providers/catalog-rpc-client';
import { EventEmitter } from './providers/event-emitter';
import { IdentityRpcClient } from './providers/identity-rpc-client';
import { NotificationsRpcClient } from './providers/notifications-rpc-client';

@Module({
  imports: [
    ModuleImportsFactory.createRpcClientModule([
      { name: IDENTITY_CLIENT, useFactory: rmqRpcBrokerConfig(IDENTITY_RPC_QUEUE) },
      { name: CATALOG_CLIENT, useFactory: rmqRpcBrokerConfig(CATALOG_RPC_QUEUE) },
      {
        name: NOTIFICATIONS_CLIENT,
        useFactory: rmqRpcBrokerConfig(NOTIFICATIONS_RPC_QUEUE),
      },
      {
        name: ORDERS_CLIENT,
        useFactory: rmqRpcBrokerConfig(ORDERS_RPC_QUEUE),
      },
      {
        name: PAYMENTS_CLIENT,
        useFactory: rmqRpcBrokerConfig(PAYMENTS_RPC_QUEUE),
      },
    ]),
    ModuleImportsFactory.createEventBusClientModule(),
  ],
  providers: [
    EventEmitter,
    CatalogRpcClient,
    IdentityRpcClient,
    NotificationsRpcClient,
  ],
  exports: [
    EventEmitter,
    CatalogRpcClient,
    IdentityRpcClient,
    NotificationsRpcClient,
  ],
})
export class TransportModule {}
