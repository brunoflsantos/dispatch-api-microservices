import { ForbiddenException } from '@nestjs/common';
import { USER_ROLE_LEVEL } from 'libs/common/constants/user-role-level.constant';
import { UserRole } from 'libs/common/enums/user-role.enum';
import { template } from 'libs/common/utils/functions.utils';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { I18N_IDENTITY } from '../../../constants/i18n.constant';
import { User } from '../entities/user.entity';

export function assertWriteAccess(targetUser: User, requestUser?: RequestUser) {
  if (!requestUser) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.AUTH_IS_REQUIRED));
  }

  const requestUserRoleLevel = USER_ROLE_LEVEL[requestUser.role];
  const targetUserRoleLevel = USER_ROLE_LEVEL[targetUser.role];

  if (requestUserRoleLevel <= targetUserRoleLevel) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.ACCESS_DENIED));
  }
}

export function assertRoleWriteAccess(
  targetRole: UserRole,
  requestUser?: RequestUser,
) {
  if (!requestUser) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.AUTH_IS_REQUIRED));
  }

  const requestUserRoleLevel = USER_ROLE_LEVEL[requestUser.role];
  const targetRoleLevel = USER_ROLE_LEVEL[targetRole];

  if (requestUserRoleLevel <= targetRoleLevel) {
    throw new ForbiddenException(template(I18N_IDENTITY.ERRORS.ROLE_CHANGE_DENIED));
  }
}
