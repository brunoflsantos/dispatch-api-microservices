import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserAddressDto, CreateUserDto } from './create-user.dto';
import {
  PublicUpdateUserRequestContract,
  UpdateUserAddressRequestContract,
  UpdateUserRequestContract,
} from 'libs/contracts/interfaces/users/update-user-request.interface';

export class UpdateUserAddressDto
  extends PartialType(CreateUserAddressDto)
  implements UpdateUserAddressRequestContract {}

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUserRequestContract
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
  implements PublicUpdateUserRequestContract {}
