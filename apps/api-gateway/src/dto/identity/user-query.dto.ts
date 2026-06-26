import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import {
  PublicUserCursorQueryInput,
  UserCursorQueryInput,
} from 'libs/contracts/interfaces/users/user-cursor-query-input.interface';

export class UserQueryDto implements Omit<UserCursorQueryInput, 'cursor'> {
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
  extends PickType(UserQueryDto, ['name'] as const)
  implements Omit<PublicUserCursorQueryInput, 'cursor'> {}
