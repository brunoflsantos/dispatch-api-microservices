import { LoginResult } from 'libs/contracts/interfaces/auth/login-result.interface';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';

export interface IAuthService extends IBaseService {
  publicLogin(email: string, password: string): Promise<LoginResult>;

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResult>;

  publicLogout(reqUser: RequestUser): Promise<void>;
}
