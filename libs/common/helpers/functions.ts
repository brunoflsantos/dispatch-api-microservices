import { JwtPayload } from 'libs/contracts/interfaces/jwt-payload.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';

export const jwtToRequestUser = (payload: JwtPayload): RequestUser => {
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    language: payload.language,
    jwt: {
      jti: payload.jti,
      refreshToken: payload.refreshToken,
    },
  };
};
