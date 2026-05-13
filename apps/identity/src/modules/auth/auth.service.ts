import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'libs/common/modules/cache/cache.service';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { CACHE_TTL } from 'libs/common/modules/cache/constants/cache-ttl.constant';
import { LOCK_KEYS } from 'libs/common/modules/cache/constants/lock-keys.constant';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { OUTBOX_SERVICE } from 'libs/common/modules/outbox/constants/outbox.token';
import type { IOutboxService } from 'libs/common/modules/outbox/interfaces/outbox-service.interface';
import { template } from 'libs/common/utils/functions.utils';
import { HashAdapter } from 'libs/common/utils/hash-adapter.utils';
import { LoginResult } from 'libs/contracts/interfaces/auth/login-result.interface';
import { JwtPayload } from 'libs/contracts/interfaces/jwt-payload.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { I18N_IDENTITY } from '../../constants/i18n.constant';
import { USER_REPOSITORY } from '../../constants/identity.token';
import { User } from '../users/entities/user.entity';
import type { IUserRepository } from '../users/interfaces/user-repository.interface';
import { IAuthService } from './interfaces/auth-service.interface';

export class AuthService extends BaseService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(OUTBOX_SERVICE)
    private readonly outboxService: IOutboxService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly guard: DbGuardService,
  ) {
    super(AuthService.name);
  }

  //#region Auth - Public

  publicLogin(email: string, password: string): Promise<LoginResult> {
    return this.guard.lockAndTransaction<LoginResult>(
      LOCK_KEYS.AUTH.LOGIN(email),
      () => this._publicLogin(email, password),
    );
  }

  private async _publicLogin(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException(
        template(I18N_IDENTITY.ERRORS.USER_NOT_FOUND, { email }),
      );

    const isValid = await HashAdapter.compare(user.password, password);
    if (!isValid)
      throw new UnauthorizedException(
        template(I18N_IDENTITY.ERRORS.INVALID_CREDENTIALS),
      );

    const result = this.generateTokens(user);
    await this.updateRefreshToken(user.id, result.refreshToken);

    // TODO: call OutboxService to create login event for analytics

    return result;
  }

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResult> {
    return this.guard.lockAndTransaction<LoginResult>(
      LOCK_KEYS.AUTH.REFRESH(reqUser.email),
      () => this._publicRefreshSession(reqUser),
    );
  }

  private async _publicRefreshSession(reqUser: RequestUser): Promise<LoginResult> {
    const refreshToken = reqUser.jwt.refreshToken;
    if (!refreshToken)
      throw new UnauthorizedException(
        template(I18N_IDENTITY.ERRORS.NO_REFRESH_TOKEN),
      );

    const user = await this.userRepository.findOne({
      where: { email: reqUser.email },
    });
    if (!user)
      throw new UnauthorizedException(
        template(I18N_IDENTITY.ERRORS.USER_NOT_FOUND, {
          email: reqUser.email,
        }),
      );

    const isValid = await HashAdapter.compare(user.refreshToken, refreshToken);
    if (!isValid) {
      await this.publicLogout(reqUser);
      throw new UnauthorizedException(
        template(I18N_IDENTITY.ERRORS.INVALID_REFRESH_TOKEN),
      );
    }

    const result = this.generateTokens(user);
    await this.updateRefreshToken(user.id, result.refreshToken);

    return result;
  }

  publicLogout(reqUser: RequestUser): Promise<void> {
    return this.guard.lockAndTransaction<void>(
      LOCK_KEYS.AUTH.LOGOUT(reqUser.email),
      () => this._publicLogout(reqUser),
    );
  }

  private async _publicLogout(reqUser: RequestUser): Promise<void> {
    await this.updateRefreshToken(reqUser.id, null);

    await this.cacheService.set(
      CACHE_KEYS.AUTH.BLACKLIST(reqUser.jwt.jti),
      true,
      CACHE_TTL.AUTH_BLACKLIST,
    );
  }

  //#endregion

  //#region Private methods

  private generateTokens(user: User): LoginResult {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      language: user.language ?? 'en',
      jti: crypto.randomUUID(),
    };

    const accessTokenExpiry =
      this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshTokenExpiry =
      this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTokenExpiry,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiry,
    });

    const result: LoginResult = {
      accessToken,
      refreshToken,
      userId: user.id,
      language: user.language ?? 'en',
    };

    return result;
  }

  private updateRefreshToken(userId: string, refreshToken?: string): Promise<void> {
    return this.guard.lock(LOCK_KEYS.USERS.UPDATE(userId), async () => {
      const hash = refreshToken ? await HashAdapter.hash(refreshToken) : null;
      await this.userRepository.update(userId, { refreshToken: hash });
    });
  }

  //#endregion
}
