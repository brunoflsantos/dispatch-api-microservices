import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { cacheConfig, redisClient } from 'libs/common/config/redis.config';
import { REDIS_CLIENT } from 'libs/common/constants/tokens/redis.token';
import Redlock from 'redlock';
import { CacheService } from './cache.service';
import { IdempotencyService } from './providers/idempotency.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: cacheConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheService,
    IdempotencyService,
    {
      provide: REDIS_CLIENT,
      useFactory: redisClient,
      inject: [ConfigService],
    },
    {
      provide: Redlock,
      useFactory: (redis: Redis) => new Redlock([redis] as any),
      inject: [REDIS_CLIENT],
    },
  ],
  exports: [CacheService, IdempotencyService, Redlock],
})
export class CacheModule {}
