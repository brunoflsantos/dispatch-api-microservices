import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import {
  rmqEventBusConfig,
  rmqRpcBrokerConfig,
} from 'libs/common/config/broker.config';
import { CATALOG_RPC_QUEUE } from 'libs/common/constants/tokens/queues.token';
import { AppExceptionFilter } from 'libs/common/filters/exception.filter';
import { Logger } from 'nestjs-pino';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Dedicated RPC queue for direct calls
  app.connectMicroservice<RmqOptions>(
    rmqRpcBrokerConfig(CATALOG_RPC_QUEUE)(configService),
  );

  // General event bus — for events from other microservices
  app.connectMicroservice<RmqOptions>(rmqEventBusConfig(configService));

  app.useGlobalFilters(new AppExceptionFilter());

  await app.startAllMicroservices();

  logger.log('Catalog microservice is running');
}

void bootstrap();
