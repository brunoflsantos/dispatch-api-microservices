import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from '../config/logger.config';
import { throttleConfig } from '../config/throttle.config';
import { rmqEventBusConfig } from '../config/transport.config';
import { EVENT_BUS_CLIENT } from '../modules/transport/constants/client-proxies.tokens';

interface CreateI18nModuleOptions {
  translationsPath: string;
  fallbackLanguage?: string;
}

interface CreateConfigModuleOptions {
  envFilePath?: string;
}

export class ModuleImportsFactory {
  // Config Module
  static createConfigModule(options: CreateConfigModuleOptions) {
    return ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: options.envFilePath,
    });
  }

  // 18N Module
  static createI18nModule(options: CreateI18nModuleOptions) {
    return I18nModule.forRoot({
      fallbackLanguage: options.fallbackLanguage ?? 'pt-BR',
      loaderOptions: {
        path: options.translationsPath,
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
    });
  }

  // Logger Module (Pino)
  static createLoggerModule() {
    return LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: loggerConfig,
      inject: [ConfigService],
    });
  }

  // Throttle Module
  static createThrottleModule() {
    return ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: throttleConfig,
      inject: [ConfigService],
    });
  }

  // TypeORM Module
  static createTypeOrmModule(
    typeOrmConfig: (configService: ConfigService) => TypeOrmModuleOptions,
  ) {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    });
  }

  // RMQ Client Modules (request-response)
  static createRpcClientModule(
    entries: Array<{
      name: string | symbol;
      useFactory: (config: ConfigService) => RmqOptions;
    }>,
  ) {
    const clients = entries.map(({ name, useFactory }) => ({
      name,
      imports: [ConfigModule],
      useFactory,
      inject: [ConfigService],
    }));
    return ClientsModule.registerAsync(clients);
  }

  // RMQ Client Modules (event bus)
  static createEventBusClientModule() {
    return ClientsModule.registerAsync([
      {
        name: EVENT_BUS_CLIENT,
        imports: [ConfigModule],
        useFactory: rmqEventBusConfig,
        inject: [ConfigService],
      },
    ]);
  }
}
