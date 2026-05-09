import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { rmqRpcBrokerConfig } from 'libs/common/config/broker.config';
import {
  CATALOG_RPC_QUEUE,
  IDENTITY_RPC_QUEUE,
} from 'libs/common/constants/tokens/queues.token';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { JwtAuthGuard } from 'libs/common/guards/jwt.guard';
import { RolesGuard } from 'libs/common/guards/roles.guard';
import { join } from 'path';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { CATALOG_CLIENT, IDENTITY_CLIENT } from './constants/gateway.tokens';
import { ApiCatalogController } from './controllers/api-catalog.controller';
import { ApiIdentityController } from './controllers/api-identity.controller';
import { ApiCatalogService } from './services/api-catalog.service';

@Module({
  imports: [
    ModuleImportsFactory.createConfigModule({
      envFilePath: join(
        process.cwd(),
        `apps/api-gateway/.env.${process.env.NODE_ENV || 'local'}`,
      ),
    }),

    ModuleImportsFactory.createLoggerModule(),

    ModuleImportsFactory.createThrottleModule(),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),

    ModuleImportsFactory.createRpcClientModule([
      { name: IDENTITY_CLIENT, useFactory: rmqRpcBrokerConfig(IDENTITY_RPC_QUEUE) },
      { name: CATALOG_CLIENT, useFactory: rmqRpcBrokerConfig(CATALOG_RPC_QUEUE) },
    ]),
  ],
  controllers: [ApiGatewayController, ApiIdentityController, ApiCatalogController],
  providers: [
    ApiGatewayService,
    ApiCatalogService,

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ApiGatewayModule {}
