import { CacheModule } from 'libs/common/modules/cache/cache.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbGuardModule } from 'libs/common/modules/db-guard/db-guard.module';
import { AUTH_SERVICE } from '../../constants/identity.token';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, DbGuardModule, CacheModule, JwtModule.register({})],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
