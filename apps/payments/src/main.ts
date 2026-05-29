import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import {
  rmqEventBusConfig,
  rmqRpcBrokerConfig,
} from 'libs/common/config/transport.config';
import { RpcExceptionConverterFilter } from 'libs/common/filters/rpc-exception.filter';
import { RpcCorrelationInterceptor } from 'libs/common/interceptors/rpc-correlation.interceptor';
import { PAYMENTS_RPC_QUEUE } from 'libs/common/modules/transport/constants/queues.token';
import { Logger } from 'nestjs-pino';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  // rawBody: true is required so StripeController can verify the webhook signature.
  const app = await NestFactory.create(PaymentsModule, { rawBody: true });

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Dedicated RPC queue for direct calls
  app.connectMicroservice<RmqOptions>(
    rmqRpcBrokerConfig(PAYMENTS_RPC_QUEUE)(configService),
  );

  // General event bus — for events from other microservices
  app.connectMicroservice<RmqOptions>(rmqEventBusConfig(configService));

  app.useGlobalFilters(new RpcExceptionConverterFilter());

  app.useGlobalInterceptors(new RpcCorrelationInterceptor());

  await app.startAllMicroservices();

  const httpPort = configService.get<number>('PAYMENTS_HTTP_PORT', 3002);
  await app.listen(httpPort);

  logger.log(`Payments microservice is running (HTTP: ${httpPort})`);
}

void bootstrap();
