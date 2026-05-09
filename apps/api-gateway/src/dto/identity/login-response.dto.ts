import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { LoginResponseContract } from 'libs/contracts/interfaces/auth/login-response.interface';

@Exclude()
export class LoginResponseDto implements LoginResponseContract {
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
