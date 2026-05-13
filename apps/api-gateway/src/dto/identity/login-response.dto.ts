import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { LoginResult } from 'libs/contracts/interfaces/auth/login-result.interface';

@Exclude()
export class LoginResponseDto implements LoginResult {
  @Expose()
  @ApiProperty({ description: 'Access token for authentication' })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
  })
  refreshToken: string;

  @Expose()
  @ApiProperty({ description: 'ID of the authenticated user' })
  userId: string;

  @Expose()
  @ApiProperty({ description: 'Language preference of the user' })
  language: string;
}
