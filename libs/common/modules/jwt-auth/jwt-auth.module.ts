import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from 'libs/common/providers/jwt/jwt-refresh.strategy';
import { JwtStrategy } from 'libs/common/providers/jwt/jwt.strategy';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PassportModule, CacheModule],
  providers: [JwtStrategy, JwtRefreshStrategy],
})
export class JwtAuthModule {}
