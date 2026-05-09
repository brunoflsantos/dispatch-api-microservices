import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { I18N_COMMON } from '../constants/i18n.constant';
import { template } from '../utils/functions.utils';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.headers['x-internal-key'];
    const expectedKey = process.env.INTERNAL_SERVICE_KEY;

    if (!expectedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException(
        template(I18N_COMMON.ERRORS.INVALID_INTERNAL_KEY),
      );
    }

    return true;
  }
}
