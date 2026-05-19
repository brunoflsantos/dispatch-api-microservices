import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UpdateAddressInput } from 'libs/contracts/interfaces/users/update-address-input.interface';
import {
  PublicUpdateUserInput,
  UpdateUserInput,
} from 'libs/contracts/interfaces/users/update-user-input.interface';
import { CreateAddressDto } from './create-address.dto';
import { CreateUserDto } from './create-user.dto';

export class UpdateAddressDto
  extends PartialType(CreateAddressDto)
  implements UpdateAddressInput {}

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
