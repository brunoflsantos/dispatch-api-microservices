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
import { Role } from 'libs/common/enums/role.enum';
import {
  CreateUserInput,
  PublicCreateUserInput,
} from 'libs/contracts/interfaces/users/create-user-input.interface';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto implements CreateUserInput {
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
    example: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'User address',
    type: CreateAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}

export class PublicCreateUserDto
  extends OmitType(CreateUserDto, ['role'] as const)
  implements PublicCreateUserInput {}
