import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { join, resolve } from 'path';
import { typeOrmIdentityConfig } from './config/orm.identity.config';
import { IDENTITY_SERVICE, USER_REPOSITORY } from './constants/identity.token';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserRepository } from './modules/users/providers/user.repository';
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
  ],
  controllers: [IdentityController],
  providers: [
    { provide: IDENTITY_SERVICE, useClass: IdentityService },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class IdentityModule {}
