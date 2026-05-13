import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginInput } from 'libs/contracts/interfaces/auth/login-input.interface';

export class LoginDto implements LoginInput {
  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@email.com',
    format: 'email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
    maxLength: 100,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
