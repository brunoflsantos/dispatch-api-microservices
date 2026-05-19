import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { JwtAuthGuard } from 'libs/common/guards/jwt.guard';
import { RolesGuard } from 'libs/common/guards/roles.guard';
import { CorrelationIdMiddleware } from 'libs/common/middleware/correlation-id.middleware';
import { LoggingMiddleware } from 'libs/common/middleware/logging.middleware';
import { TransportModule } from 'libs/common/modules/transport/transport.module';
import { join } from 'path';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ApiCatalogController } from './controllers/api-catalog.controller';
import { ApiIdentityController } from './controllers/api-identity.controller';
import { ApiNotificationsController } from './controllers/api-notifications.controller';
import { ApiPaymentsController } from './controllers/api-payments.controller';

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

    TransportModule,
  ],
  controllers: [
    ApiGatewayController,
    ApiIdentityController,
    ApiCatalogController,
    ApiNotificationsController,
    ApiPaymentsController,
  ],
  providers: [
    ApiGatewayService,

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ApiGatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware, LoggingMiddleware).forRoutes('*');
  }
}
