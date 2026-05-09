import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import {
  rmqEventBusConfig,
  rmqRpcBrokerConfig,
} from 'libs/common/config/broker.config';
import { IDENTITY_RPC_QUEUE } from 'libs/common/constants/tokens/queues.token';
import { AppExceptionFilter } from 'libs/common/filters/exception.filter';
import { Logger } from 'nestjs-pino';
import { IdentityModule } from './identity.module';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Dedicated RPC queue for direct calls
  app.connectMicroservice<RmqOptions>(
    rmqRpcBrokerConfig(IDENTITY_RPC_QUEUE)(configService),
  );

  // General event bus — for events from other microservices
  app.connectMicroservice<RmqOptions>(rmqEventBusConfig(configService));

  app.useGlobalFilters(new AppExceptionFilter());

  await app.startAllMicroservices();

  logger.log('Identity microservice is running');
}

void bootstrap();
