import { ForbiddenException } from '@nestjs/common';
import { I18N_IDENTITY } from 'apps/identity/src/constants/i18n.constant';
import { ROLE_LEVELS } from 'libs/common/constants/role-levels.constant';
import { Role } from 'libs/common/enums/role.enum';
import { template } from 'libs/common/utils/functions.utils';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { User } from '../entities/user.entity';

export function assertWriteAccess(targetUser: User, requestUser?: RequestUser) {
  if (!requestUser) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.AUTH_IS_REQUIRED));
  }

  const requestUserRoleLevel = ROLE_LEVELS[requestUser.role];
  const targetUserRoleLevel = ROLE_LEVELS[targetUser.role];

  if (requestUserRoleLevel <= targetUserRoleLevel) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.ACCESS_DENIED));
  }
}

export function assertRoleWriteAccess(targetRole: Role, requestUser?: RequestUser) {
  if (!requestUser) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.AUTH_IS_REQUIRED));
  }

  const requestUserRoleLevel = ROLE_LEVELS[requestUser.role];
  const targetRoleLevel = ROLE_LEVELS[targetRole];

  if (requestUserRoleLevel <= targetRoleLevel) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.ROLE_CHANGE_DENIED));
  }
}
