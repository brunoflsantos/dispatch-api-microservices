import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { OffsetQueryDto } from 'libs/contracts/dto/base-query.dto';
import {
  PublicUserOffsetQueryInput,
  UserOffsetQueryInput,
} from 'libs/contracts/interfaces/users/user-offset-query-input.interface';

export class UserOffsetQueryDto
  extends OffsetQueryDto
  implements UserOffsetQueryInput
{
  @ApiPropertyOptional({
    description: 'Filter users by name (partial match)',
    example: 'João',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter users by email (partial match)',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class PublicUserQueryDto
  extends PickType(UserOffsetQueryDto, ['name'] as const)
  implements PublicUserOffsetQueryInput {}
