import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { DbGuardModule } from 'libs/common/modules/db-guard/db-guard.module';
import { OutboxModule } from 'libs/common/modules/outbox/outbox.module';
import { AUTH_SERVICE } from '../../constants/identity.token';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, DbGuardModule, CacheModule, OutboxModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
