import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, RmqOptions } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { rmqEventBusConfig } from '../config/broker.config';
import { loggerConfig } from '../config/logger.config';
import { throttleConfig } from '../config/throttle.config';

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

  static createClientModule(...name: (string | symbol)[]) {
    const clients = name.map((clientName: string | symbol) => ({
      name: clientName,
      imports: [ConfigModule],
      useFactory: rmqEventBusConfig,
      inject: [ConfigService],
    }));
    return ClientsModule.registerAsync(clients);
  }

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
}
