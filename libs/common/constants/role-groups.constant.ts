import { Role } from '../enums/role.enum';

export const ROLE_GROUPS = {
  ADMIN_MANAGEMENT: [Role.SUPERADMIN, Role.ADMIN] as Role[],
} as const;
