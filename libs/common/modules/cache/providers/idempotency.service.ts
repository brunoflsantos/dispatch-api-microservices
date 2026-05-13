import { AppLogger } from '@/shared/utils/app-logger.utils';
import { Injectable } from '@nestjs/common';
import { CACHE_TTL } from 'libs/common/modules/cache/constants/cache-ttl.constant';
import { CacheService } from '../cache.service';

@Injectable()
export class IdempotencyService {
  private readonly logger = new AppLogger(IdempotencyService.name);

  constructor(private readonly cacheService: CacheService) {}

  /**
   * Executes a function and caches its result for idempotency.
   * If the result is already cached, it returns the cached value.
   * @param cacheKey The key to use for caching the result.
   * @param fn The function to execute if the result is not cached.
   * @returns The result of the function, either from cache or freshly executed.
   */
  async getOrExecute<T>(cacheKey: string, fn: () => Promise<T>): Promise<T> {
    const cached = await this.cacheService.get<T>(cacheKey);

    if (cached !== undefined && cached !== null) {
      this.logger.debug('Returning cached idempotent result', { cacheKey });
      return cached;
    }

    const result = await fn();

    await this.cacheService.set(cacheKey, result, CACHE_TTL.IDEMPOTENCY);

    return result;
  }
}
