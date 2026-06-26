import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { TransportModule } from 'libs/common/modules/transport/transport.module';
import { join, resolve } from 'path';
import { typeOrmIdentityConfig } from './config/orm.identity.config';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ModuleImportsFactory.createConfigModule({
      envFilePath: resolve(
        process.cwd(),
        `apps/identity/.env.${process.env.NODE_ENV || 'local'}`,
      ),
    }),

    ModuleImportsFactory.createLoggerModule(),

    ModuleImportsFactory.createTypeOrmModule(typeOrmIdentityConfig),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),

    AuthModule,

    UsersModule,

    TransportModule,
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
