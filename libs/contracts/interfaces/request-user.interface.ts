import { Role } from 'libs/common/enums/role.enum';

export interface RequestUser {
  id: string;

  email: string;

  role: Role;

  language: string;

  jwt: {
    jti: string; // JWT ID, to identify the token and facilitate revocation

    refreshToken?: string; // Optional field to store the refresh token for validation in the refresh strategy
  };
}
