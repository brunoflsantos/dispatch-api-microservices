import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  PublicUpdateUserInput,
  UpdateUserAddressRequestContract,
  UpdateUserInput,
} from 'libs/contracts/interfaces/users/update-user-input.interface';
import { CreateUserAddressDto, CreateUserDto } from './create-user.dto';

export class UpdateUserAddressDto
  extends PartialType(CreateUserAddressDto)
  implements UpdateUserAddressRequestContract {}

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUserInput
{
  @ApiPropertyOptional({
    description: 'User current password (required if changing password)',
    example: 'currentPassword123',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  @ValidateIf((o) => o.password !== undefined)
  currentPassword?: string;
}

export class PublicUpdateUserDto
  extends OmitType(UpdateUserDto, ['role'] as const)
  implements PublicUpdateUserInput {}
