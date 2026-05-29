import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'libs/common/decorators/public.decorator';
import {
  CATALOG_RPC_QUEUE,
  IDENTITY_RPC_QUEUE,
  NOTIFICATIONS_RPC_QUEUE,
  ORDERS_RPC_QUEUE,
  PAYMENTS_RPC_QUEUE,
} from 'libs/common/modules/transport/constants/queues.token';

@Controller()
export class ApiGatewayController {
  private readonly brokerUrl: string;

  constructor(
    private readonly health: HealthCheckService,
    private readonly microserviceHealth: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {
    this.brokerUrl = this.configService.getOrThrow<string>('BROKER_URL');
  }

  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  healthCheck() {
    return this.health.check([
      async () =>
        this.microserviceHealth.pingCheck('catalog-service', {
          transport: Transport.RMQ,
          options: {
            urls: [this.brokerUrl],
            queue: CATALOG_RPC_QUEUE,
          },
        }),
      async () =>
        this.microserviceHealth.pingCheck('identity-service', {
          transport: Transport.RMQ,
          options: {
            urls: [this.brokerUrl],
            queue: IDENTITY_RPC_QUEUE,
          },
        }),
      async () =>
        this.microserviceHealth.pingCheck('notifications-service', {
          transport: Transport.RMQ,
          options: {
            urls: [this.brokerUrl],
            queue: NOTIFICATIONS_RPC_QUEUE,
          },
        }),
      async () =>
        this.microserviceHealth.pingCheck('orders-service', {
          transport: Transport.RMQ,
          options: {
            urls: [this.brokerUrl],
            queue: ORDERS_RPC_QUEUE,
          },
        }),
      async () =>
        this.microserviceHealth.pingCheck('payments-service', {
          transport: Transport.RMQ,
          options: {
            urls: [this.brokerUrl],
            queue: PAYMENTS_RPC_QUEUE,
          },
        }),
    ]);
  }
}
