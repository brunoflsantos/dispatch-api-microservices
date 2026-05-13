import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { OffsetQueryDto } from 'libs/contracts/dto/base-query.dto';
import {
  PublicUserQueryInput,
  UserQueryRequestInput,
} from 'libs/contracts/interfaces/users/update-user-query-input.interface';

export class UserQueryDto extends OffsetQueryDto implements UserQueryRequestInput {
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
  implements PublicUserQueryInput {}
