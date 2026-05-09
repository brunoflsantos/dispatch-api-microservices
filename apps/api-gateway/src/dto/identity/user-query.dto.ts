import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseQueryDto } from 'libs/contracts/dto/base-query.dto';
import {
  PublicUserQueryRequestContract,
  UserQueryRequestContract,
} from 'libs/contracts/interfaces/users/update-user-query-request.interface';

export class UserQueryDto extends BaseQueryDto implements UserQueryRequestContract {
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
  implements PublicUserQueryRequestContract {}
