import { Role } from 'libs/common/enums/role.enum';

export const ORDERS_ROLE_GROUPS = {
  FINANCIAL: [Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL] as Role[],

  MANAGEMENT: [Role.SUPERADMIN, Role.ADMIN] as Role[],

  SHIPPING: [Role.SUPERADMIN, Role.ADMIN, Role.SHIPPER] as Role[],

  DELIVERY: [Role.SUPERADMIN, Role.ADMIN, Role.DELIVERY] as Role[],
} as const;
