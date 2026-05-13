import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { I18N_COMMON } from 'libs/common/constants/i18n.constant';
import { JWT_ACCESS } from 'libs/common/constants/tokens/jwt-names.token';
import { jwtToRequestUser } from 'libs/common/helpers/functions';
import { CacheService } from 'libs/common/modules/cache/cache.service';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { template } from 'libs/common/utils/functions.utils';
import { JwtPayload } from 'libs/contracts/interfaces/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_ACCESS) {
  constructor(
    configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const isBlacklisted = await this.cacheService.get(
      CACHE_KEYS.AUTH.BLACKLIST(payload.jti),
    );
    if (isBlacklisted) {
      throw new UnauthorizedException(template(I18N_COMMON.ERRORS.TOKEN_REVOKED));
    }
    return jwtToRequestUser(payload); // Req.user
  }
}
