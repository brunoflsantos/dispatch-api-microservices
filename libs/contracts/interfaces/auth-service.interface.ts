import { LoginResponseDto } from '../../../apps/api-gateway/src/dto/identity/login-response.dto';
import { IBaseService } from './base-service.interface';
import type { RequestUser } from './request-user.interface';

export interface IAuthService extends IBaseService {
  login(email: string, password: string): Promise<LoginResponseDto>;

  refresh(reqUser: RequestUser): Promise<LoginResponseDto>;

  logout(reqUser: RequestUser): Promise<void>;
}
