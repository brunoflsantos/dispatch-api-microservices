import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import {
  rmqEventBusConfig,
  rmqRpcBrokerConfig,
} from 'libs/common/config/transport.config';
import { RpcExceptionConverterFilter } from 'libs/common/filters/rpc-exception.filter';
import { RpcCorrelationInterceptor } from 'libs/common/interceptors/rpc-correlation.interceptor';
import { NOTIFICATIONS_RPC_QUEUE } from 'libs/common/modules/transport/constants/queues.token';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Dedicated RPC queue for direct calls
  app.connectMicroservice<RmqOptions>(
    rmqRpcBrokerConfig(NOTIFICATIONS_RPC_QUEUE)(configService),
  );

  // General event bus — for events from other microservices
  app.connectMicroservice<RmqOptions>(rmqEventBusConfig(configService));

  app.useGlobalFilters(new RpcExceptionConverterFilter());

  app.useGlobalInterceptors(new RpcCorrelationInterceptor());

  await app.init();
  await app.startAllMicroservices();

  logger.log('Notifications microservice is running');
}

void bootstrap();
