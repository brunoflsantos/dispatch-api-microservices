import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { EVENT_BUS_QUEUE } from '../constants/tokens/queues.token';

export const rmqEventBusConfig = (configService: ConfigService): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [configService.get<string>('RABBITMQ_URL')],
    queue: EVENT_BUS_QUEUE,
    queueOptions: {
      durable: false,
    },
  },
});

export const rmqRpcBrokerConfig =
  (queue: string) =>
  (configService: ConfigService): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue,
      queueOptions: {
        durable: false,
      },
    },
  });
