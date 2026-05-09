import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH } from '../constants/tokens/jwt-names.token';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(JWT_REFRESH) {}
