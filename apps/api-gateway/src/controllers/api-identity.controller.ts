import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'libs/common/decorators/get-user.decorator';
import { Public } from 'libs/common/decorators/public.decorator';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { Role } from 'libs/common/enums/role.enum';
import { JwtRefreshAuthGuard } from 'libs/common/guards/jwt-refresh.guard';
import {
  AdminCreateUserRpcInput,
  AdminFindAllUsersRpcInput,
  AdminFindOneUserRpcInput,
  AdminRemoveUserRpcInput,
  AdminUpdateUserRpcInput,
  PublicCreateUserRpcInput,
  PublicFindAllUsersRpcInput,
  PublicFindMyUserRpcInput,
  PublicFindOneUserRpcInput,
  PublicLoginRpcInput,
  PublicLogoutRpcInput,
  PublicRefreshRpcInput,
  PublicRemoveMyUserRpcInput,
  PublicUpdateUserRpcInput,
} from 'libs/common/modules/transport/dto/identity-rpc.input';
import { IdentityRpcClient } from 'libs/common/modules/transport/providers/identity-rpc-client';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { CreateUserDto, PublicCreateUserDto } from '../dto/identity/create-user.dto';
import { LoginDto } from '../dto/identity/login.dto';
import { PublicUpdateUserDto, UpdateUserDto } from '../dto/identity/update-user.dto';
import { PublicUserQueryDto, UserQueryDto } from '../dto/identity/user-query.dto';

@Controller('identity')
@ApiTags('identity')
@ApiBearerAuth()
export class ApiIdentityController extends BaseController {
  constructor(private readonly identityRpcClient: IdentityRpcClient) {
    super(ApiIdentityController.name);
  }

  //#region Auth

  @Public()
  @Post('public/auth/login')
  publicLogin(@Body() dto: LoginDto) {
    return this.identityRpcClient.call(
      new PublicLoginRpcInput({ email: dto.email, password: dto.password }),
    );
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('public/auth/refresh')
  publicRefreshSession(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicRefreshRpcInput({ reqUser }));
  }

  @Post('public/auth/logout')
  publicLogout(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicLogoutRpcInput({ reqUser }));
  }

  //#endregion

  //#region Users - Public

  @Public()
  @Post('public/users')
  publicCreateUser(
    @Body() dto: PublicCreateUserDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.identityRpcClient.call(
      new PublicCreateUserRpcInput({ dto, idempotencyKey }),
    );
  }

  @Get('public/users/me')
  publicFindMyUser(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicFindMyUserRpcInput({ reqUser }));
  }

  @Public()
  @Get('public/users/:id')
  publicFindOneUser(@Param('id') id: string) {
    return this.identityRpcClient.call(new PublicFindOneUserRpcInput({ id }));
  }

  @Public()
  @Get('public/users')
  publicFindAllUsers(@Query() query: PublicUserQueryDto) {
    return this.identityRpcClient.call(new PublicFindAllUsersRpcInput({ query }));
  }

  @Put('public/users/me')
  publicUpdateUser(
    @Body() dto: PublicUpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.identityRpcClient.call(
      new PublicUpdateUserRpcInput({ dto, reqUser }),
    );
  }

  @Delete('public/users/me')
  publicRemoveMyUser(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicRemoveMyUserRpcInput({ reqUser }));
  }

  //#endregion

  //#region Users - Admin

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('admin/users')
  adminCreateUser(
    @Body() dto: CreateUserDto,
    @GetUser() reqUser: RequestUser,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.identityRpcClient.call(
      new AdminCreateUserRpcInput({ dto, idempotencyKey, reqUser }),
    );
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('admin/users')
  adminFindAllUsers(@Query() query: UserQueryDto, @GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(
      new AdminFindAllUsersRpcInput({ query, reqUser }),
    );
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('admin/users/:id')
  adminFindOneUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(
      new AdminFindOneUserRpcInput({ id, reqUser }),
    );
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put('admin/users/:id')
  adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.identityRpcClient.call(
      new AdminUpdateUserRpcInput({ id, dto, reqUser }),
    );
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('admin/users/:id')
  adminRemoveUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new AdminRemoveUserRpcInput({ id, reqUser }));
  }

  //#endregion
}
