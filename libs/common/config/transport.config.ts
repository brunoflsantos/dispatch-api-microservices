import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { EVENT_BUS_QUEUE } from '../modules/transport/constants/queues.token';

export const rmqEventBusConfig = (configService: ConfigService): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [configService.get<string>('BROKER_URL')],
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
      urls: [configService.get<string>('BROKER_URL')],
      queue,
      queueOptions: {
        durable: false,
      },
    },
  });
