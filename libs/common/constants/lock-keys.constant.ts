export const LOCK_KEYS = {
  AUTH: {
    LOGIN: (uniqueId: string) => `auth-login:${uniqueId}`,
    REFRESH: (uniqueId: string) => `auth-refresh:${uniqueId}`,
    LOGOUT: (uniqueId: string) => `auth-logout:${uniqueId}`,
  } as const,

  USERS: {
    CREATE: (uniqueId: string) => `user-create:${uniqueId}`,
    UPDATE: (uniqueId: string) => `user-update:${uniqueId}`,
    REMOVE: (uniqueId: string) => `user-remove:${uniqueId}`,
  } as const,

  ORDERS: {
    CREATE: (uniqueId: string) => `order-create:${uniqueId}`,
    UPDATE: (uniqueId: string) => `order-update:${uniqueId}`,
    REMOVE: (uniqueId: string) => `order-remove:${uniqueId}`,
  } as const,

  PRODUCTS: {
    CREATE: (uniqueId: string) => `product-create:${uniqueId}`,
    UPDATE: (uniqueId: string) => `product-update:${uniqueId}`,
    REMOVE: (uniqueId: string) => `product-remove:${uniqueId}`,
  } as const,

  NOTIFICATIONS: {
    CREATE: (uniqueId: string) => `notification-create:${uniqueId}`,
    UPDATE: (uniqueId: string) => `notification-update:${uniqueId}`,
    REMOVE: (uniqueId: string) => `notification-remove:${uniqueId}`,
  } as const,

  JOB: {
    EXECUTE: (uniqueId: string) => `job-execute:${uniqueId}`,
  } as const,
} as const;
