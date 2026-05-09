import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from '../../constants/identity.token';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
