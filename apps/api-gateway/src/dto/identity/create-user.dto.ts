import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from 'libs/common/enums/user-role.enum';
import {
  CreateUserAddressRequestContract,
  CreateUserRequestContract,
  PublicCreateUserRequestContract,
} from 'libs/contracts/interfaces/users/create-user-request.interface';
import { BaseAddressDto } from './create-address.dto';

export class CreateUserAddressDto
  extends BaseAddressDto
  implements CreateUserAddressRequestContract {}

export class CreateUserDto implements CreateUserRequestContract {
  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({
    description: 'User preferred language',
    example: 'pt-BR',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User address',
    type: CreateUserAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address?: CreateUserAddressDto;
}

export class PublicCreateUserDto
  extends OmitType(CreateUserDto, ['role'] as const)
  implements PublicCreateUserRequestContract {}
