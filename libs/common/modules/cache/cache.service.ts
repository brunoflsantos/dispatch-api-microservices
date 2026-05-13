import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'libs/common/constants/tokens/redis.token';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis, // Used for delete in batch with pattern
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.cacheManager.disconnect();
    await this.redisClient.quit();
  }

  /**
   * Retrieves a value from the cache by its key.
   * @param key The key of the cache entry.
   * @returns The cached value or undefined if not found.
   */
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * Sets a value in the cache with an optional time-to-live (TTL).
   * @param key The key of the cache entry.
   * @param value The value to be cached.
   * @param ttl Optional time-to-live in seconds.
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Deletes a value from the cache by its key.
   * @param key The key of the cache entry to delete.
   */
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Deletes cache entries that match a specific pattern.
   * @param listCacheKey The pattern to match cache keys.
   */
  async deletePattern(listCacheKey: string): Promise<void> {
    const keys: string[] = await this.redisClient.keys(listCacheKey);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  /**
   * Deletes cache entries based on the provided options.
   * @param options Object containing keys and patterns to delete from the cache.
   */
  async deleteBulk(options: {
    keys?: string[];
    patterns?: string[];
  }): Promise<void> {
    const keysToDelete: string[] = options.keys || [];
    const patternsToDelete: string[] = options.patterns || [];

    await Promise.all([
      // Delete specific keys
      ...keysToDelete.map((key) => this.delete(key)),
      // Delete pattern-based keys
      ...patternsToDelete.map((pattern) => this.deletePattern(pattern)),
    ]);
  }
}
