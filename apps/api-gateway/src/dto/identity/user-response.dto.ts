import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'libs/common/enums/role.enum';
import {
  PublicUserResult,
  UserAddressResponseContract,
  UserResult,
  UserSelfResult,
} from 'libs/contracts/interfaces/users/user-result.interface';
import { BaseAddressDto } from './create-address.dto';

@Exclude()
export class UserAddressResponseDto
  extends BaseAddressDto
  implements UserAddressResponseContract {}

@Exclude()
export class UserResponseDto implements UserResult {
  @Expose()
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@email.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'User role',
    example: Role.USER,
  })
  role: Role;

  @Expose()
  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T12:00:00Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'User preferred language',
    example: 'pt-BR',
  })
  language: string;

  @Expose()
  @ApiProperty({
    description: 'User address',
    type: UserAddressResponseDto,
    nullable: true,
  })
  address?: UserAddressResponseDto;
}

@Exclude()
export class UserSelfResponseDto
  extends OmitType(UserResponseDto, ['role', 'updatedAt'] as const)
  implements UserSelfResult {}

@Exclude()
export class PublicUserResponseDto
  extends PickType(UserResponseDto, ['id', 'name', 'createdAt'] as const)
  implements PublicUserResult {}
