import { BaseCursorQueryInput } from 'libs/contracts/interfaces/base-cursor-query-input.interface';
import { CacheKeysFactory } from '../factories/cache-keys.factory';

export const CACHE_KEYS = {
  AUTH: {
    BLACKLIST: (token: string) => CacheKeysFactory.blacklist(token),
  } as const,

  PRODUCTS: {
    IDEMPOTENCY: (operation: string, uniqueId: string) =>
      CacheKeysFactory.idempotency('products', operation, uniqueId),

    CACHE_FIND_ALL: <T extends BaseCursorQueryInput>(query: Partial<T>) =>
      CacheKeysFactory.cache('products', 'findAll', JSON.stringify(query)),

    CACHE_FIND_ONE: (id: string) =>
      CacheKeysFactory.cache('products', 'findOne', id),

    CACHE_FIND_ALL_PATTERN: () =>
      CacheKeysFactory.cachePattern('products', 'findAll'),
  } as const,

  ORDERS: {
    IDEMPOTENCY: (method: string, id: string) =>
      CacheKeysFactory.idempotency('orders', method, id),

    CACHE_FIND_ONE: (id: string) => CacheKeysFactory.cache('orders', 'findOne', id),

    CACHE_FIND_ALL: <T extends BaseCursorQueryInput>(query: Partial<T>) =>
      CacheKeysFactory.cache('orders', 'findAll', JSON.stringify(query)),

    CACHE_FIND_ALL_PATTERN: () => CacheKeysFactory.cachePattern('orders', 'findAll'),

    VALIDATE_IF_PAID: (param: string) => CacheKeysFactory.validate(param),
  } as const,

  PAYMENTS: {
    IDEMPOTENCY: (method: string, id: string) =>
      CacheKeysFactory.idempotency('payments', method, id),
  } as const,

  USERS: {
    IDEMPOTENCY: (operation: string, uniqueId: string) =>
      CacheKeysFactory.idempotency('users', operation, uniqueId),

    CACHE_FIND_ALL: <T extends BaseCursorQueryInput>(query: Partial<T>) =>
      CacheKeysFactory.cache('users', 'findAll', JSON.stringify(query)),

    CACHE_FIND_ONE: (id: string) => CacheKeysFactory.cache('users', 'findOne', id),

    CACHE_FIND_BY_EMAIL: (email: string) =>
      CacheKeysFactory.cache('users', 'findByEmail', email),

    CACHE_FIND_ALL_PATTERN: () => CacheKeysFactory.cachePattern('users', 'findAll'),
  } as const,
} as const;
