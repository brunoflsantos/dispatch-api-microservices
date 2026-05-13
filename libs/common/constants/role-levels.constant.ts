import { Role } from '../enums/role.enum';

export const ROLE_LEVELS = {
  [Role.SUPERADMIN]: 99,
  [Role.ADMIN]: 10,
  [Role.SHIPPER]: 2,
  [Role.DELIVERY]: 2,
  [Role.FINANCIAL]: 2,
  [Role.USER]: 1,
} as const;
