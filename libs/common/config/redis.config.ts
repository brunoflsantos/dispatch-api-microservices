import { createKeyv } from '@keyv/redis';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CACHE_TTL } from 'libs/common/modules/cache/constants/cache-ttl.constant';

export const cacheConfig = (configService: ConfigService): CacheModuleOptions => ({
  stores: [
    createKeyv(
      configService.get('REDIS_URL') ||
        `redis://${configService.get('REDIS_HOST') || 'localhost'}:${configService.get('REDIS_PORT') || 6379}`,
    ),
  ],
  ttl: configService.get('CACHE_TTL') || CACHE_TTL.DEFAULT,
  isGlobal: true,
});

export const redisClient = (configService: ConfigService): Redis => {
  const redisUrl =
    configService.get('REDIS_URL') ||
    `redis://${configService.get('REDIS_HOST') || 'localhost'}:${configService.get('REDIS_PORT') || 6379}`;
  if (redisUrl) {
    return new Redis(redisUrl);
  }

  return new Redis({
    host: configService.get('REDIS_HOST') || 'localhost',
    port: configService.get('REDIS_PORT') || 6379,
    password: configService.get('REDIS_PASSWORD') || undefined,
  });
};
