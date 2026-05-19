import { TransactionContext } from '@/shared/utils/transaction-context.utils';
import { Injectable } from '@nestjs/common';
import { CACHE_TTL } from 'libs/common/modules/cache/constants/cache-ttl.constant';
import Redlock from 'redlock';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class DbGuardService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redlock: Redlock,
  ) {}

  /**
   * Executes the provided work within a database transaction.
   * @param work The work to be executed within the transaction.
   * @returns The result of the work.
   */
  async transaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) =>
      TransactionContext.run(manager, () => work(manager)),
    );
  }

  /**
   * Acquires a lock and executes the provided work within the lock.
   * @param key The key for the lock.
   * @param work The work to be executed within the lock.
   * @param ttl The time-to-live for the lock in milliseconds. If not provided, a
   * default value will be used.
   * @returns The result of the work.
   */
  async lock<T>(key: string, work: () => Promise<T>, ttl?: number): Promise<T> {
    return this.lockMany([key], work, ttl);
  }

  /**
   * Acquires multiple locks and executes the provided work within the locks.
   * @param keys The keys for the locks.
   * @param work The work to be executed within the locks.
   * @param ttl The time-to-live for the locks in milliseconds. If not provided, a
   * default value will be used.
   * @returns The result of the work.
   */
  async lockMany<T>(
    keys: string[],
    work: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const locks = keys.map((k) => this.redlock.acquire([k], ttl ?? CACHE_TTL.LOCK));
    try {
      return await work();
    } finally {
      // Release errors (e.g. lock expired before release) are non-fatal: the work is
      // already done and no duplicate execution is possible at this point.
      // Swallowing keeps the caller clean and avoids unhandled rejections when Redis
      // is flushed externally (e.g. in tests).
      await Promise.all(
        locks.map((lock) =>
          lock.then((l) => this.redlock.release(l).catch(() => undefined)),
        ),
      );
    }
  }

  /**
   * Acquires a lock and executes a transaction within the lock.
   * @param key The key for the lock.
   * @param work The work to be executed within the lock and transaction.
   * @param ttl The time-to-live for the lock in milliseconds. If not provided, a
   * default value will be used.
   * @returns The result of the work.
   */
  async lockAndTransaction<T>(
    key: string,
    work: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    return this.lock(key, () => this.transaction(() => work()), ttl);
  }
}
