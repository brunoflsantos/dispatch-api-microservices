import { LoginResponseContract } from 'libs/contracts/interfaces/auth/login-response.interface';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';

export interface IAuthService extends IBaseService {
  publicLogin(email: string, password: string): Promise<LoginResponseContract>;

  publicRefreshSession(reqUser: RequestUser): Promise<LoginResponseContract>;

  publicLogout(reqUser: RequestUser): Promise<void>;
}
