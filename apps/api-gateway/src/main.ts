import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppExceptionFilter } from 'libs/common/filters/exception.filter';
import { Logger } from 'nestjs-pino';
import { ApiGatewayModule } from './api-gateway.module';

function configureSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  const config = new DocumentBuilder()
    .setTitle(configService.get('API_TITLE') || 'Dispatch API')
    .setDescription(
      configService.get('API_DESCRIPTION') ||
        'E-commerce API built with NestJS microservices architecture',
    )
    .setVersion(configService.get('API_VERSION') || '1.0.0')
    .addTag('default', 'App default endpoints')
    .addTag('identity', 'Identity endpoints')
    .addTag('catalog', 'Catalog endpoints')
    .addTag('orders', 'Orders endpoints')
    .addTag('notifications', 'Notifications endpoints')
    .addTag('payments', 'Payments endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

function configureSecurity(
  app: INestApplication,
  configService: ConfigService,
): void {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
        },
      },
    }),
  );

  app.enableCors({
    origin: configService.get('TEST_ENV') === 'true' ? '*' : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'idempotency-key',
      'stripe-signature',
    ],
  });
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get('APP_PORT') || 3000;

  app.useGlobalFilters(new AppExceptionFilter());

  configureSwagger(app, configService);

  configureSecurity(app, configService);

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
  if (configService.get('TEST_ENV') === 'true') {
    logger.warn(
      'TEST_ENV is set to true. Rate limiting is disabled, so the application may be vulnerable to abuse. Make sure to set TEST_ENV to false in production!',
      'Bootstrap',
    );
  }
}

void bootstrap();
