import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { resolveThrottleLimit } from 'libs/common/config/throttle.config';
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
import { CursorParamsPipe } from 'libs/common/pipes/cursor-params.pipe';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { CreateUserDto, PublicCreateUserDto } from '../dto/identity/create-user.dto';
import { LoginResponseDto } from '../dto/identity/login-response.dto';
import { LoginDto } from '../dto/identity/login.dto';
import { PublicUpdateUserDto, UpdateUserDto } from '../dto/identity/update-user.dto';
import { PublicUserQueryDto, UserQueryDto } from '../dto/identity/user-query.dto';
import {
  PublicUserResponseDto,
  UserSelfResponseDto,
} from '../dto/identity/user-response.dto';

@Controller('identity')
@ApiTags('identity')
@ApiBearerAuth()
export class ApiIdentityController extends BaseController {
  constructor(private readonly identityRpcClient: IdentityRpcClient) {
    super(ApiIdentityController.name);
  }

  //#region Auth - Public

  @Post('public/auth/login')
  @Public()
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user and return access and refresh tokens',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: LoginResponseDto,
  })
  publicLogin(@Body() dto: LoginDto) {
    return this.identityRpcClient.call(
      new PublicLoginRpcInput({ email: dto.email, password: dto.password }),
    );
  }

  @Post('public/auth/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: 'Refresh user session',
    description: 'Refresh the access token using a valid refresh token',
  })
  @ApiOkResponse({
    description: 'User session refreshed successfully',
    type: LoginResponseDto,
  })
  publicRefreshSession(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicRefreshRpcInput({ reqUser }));
  }

  @Post('public/auth/logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Invalidate the current user session and tokens',
  })
  @ApiNoContentResponse({ description: 'User logged out successfully' })
  publicLogout(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicLogoutRpcInput({ reqUser }));
  }

  //#endregion

  //#region Users - Public

  @Post('public/users')
  @Public()
  @Throttle({ default: { limit: resolveThrottleLimit(5) } })
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user account with the provided details',
  })
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Unique key to prevent duplicate user creation',
    required: true,
  })
  @ApiBody({ type: PublicCreateUserDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserSelfResponseDto,
  })
  publicCreateUser(
    @Body() dto: PublicCreateUserDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.identityRpcClient.call(
      new PublicCreateUserRpcInput({ dto, idempotencyKey }),
    );
  }

  @Get('public/users/me')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve the details of the currently authenticated user',
  })
  @ApiOkResponse({
    description: 'Current user retrieved successfully',
    type: UserSelfResponseDto,
  })
  publicFindMyUser(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicFindMyUserRpcInput({ reqUser }));
  }

  @Get('public/users/:id')
  @Public()
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve the details of a user by their ID',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserSelfResponseDto,
  })
  publicFindOneUser(@Param('id') id: string) {
    return this.identityRpcClient.call(new PublicFindOneUserRpcInput({ id }));
  }

  @Get('public/users')
  @Public()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a paginated list of all users',
  })
  // @ApiQuery({ type: PublicUserQueryDto })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: PagCursorResultDto<PublicUserResponseDto>,
  })
  publicFindAllUsers(
    @Query() query: PublicUserQueryDto,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.identityRpcClient.call(
      new PublicFindAllUsersRpcInput({ query: { ...query, cursor } }),
    );
  }

  @Patch('public/users/me')
  @Throttle({ default: { limit: resolveThrottleLimit(10) } })
  @ApiOperation({
    summary: 'Update current user',
    description: 'Update the details of the currently authenticated user',
  })
  @ApiBody({ type: PublicUpdateUserDto })
  @ApiOkResponse({
    description: 'Current user updated successfully',
    type: UserSelfResponseDto,
  })
  publicUpdateUser(
    @Body() dto: PublicUpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.identityRpcClient.call(
      new PublicUpdateUserRpcInput({ dto, reqUser }),
    );
  }

  @Delete('public/users/me')
  @Throttle({ default: { limit: resolveThrottleLimit(10) } })
  @ApiOperation({
    summary: 'Delete current user',
    description: 'Delete the currently authenticated user',
  })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  publicRemoveMyUser(@GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new PublicRemoveMyUserRpcInput({ reqUser }));
  }

  //#endregion

  //#region Users - Admin

  @Post('admin/users')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new user (admin)',
    description: 'Create a new user account with the provided details (admin)',
  })
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Unique key to prevent duplicate user creation',
    required: true,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserSelfResponseDto,
  })
  adminCreateUser(
    @Body() dto: CreateUserDto,
    @GetUser() reqUser: RequestUser,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.identityRpcClient.call(
      new AdminCreateUserRpcInput({ dto, idempotencyKey, reqUser }),
    );
  }

  @Get('admin/users')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Get all users (admin)',
    description: 'Retrieve a paginated list of all users (admin)',
  })
  // @ApiQuery({ type: UserQueryDto })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: PagCursorResultDto<UserSelfResponseDto>,
  })
  adminFindAllUsers(
    @Query() query: UserQueryDto,
    @GetUser() reqUser: RequestUser,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.identityRpcClient.call(
      new AdminFindAllUsersRpcInput({ query: { ...query, cursor }, reqUser }),
    );
  }

  @Get('admin/users/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Get a user by ID (admin)',
    description: 'Retrieve the details of a specific user by ID (admin)',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserSelfResponseDto,
  })
  adminFindOneUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(
      new AdminFindOneUserRpcInput({ id, reqUser }),
    );
  }

  @Put('admin/users/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Update a user by ID (admin)',
    description: 'Update the details of a specific user by ID (admin)',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserSelfResponseDto,
  })
  adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.identityRpcClient.call(
      new AdminUpdateUserRpcInput({ id, dto, reqUser }),
    );
  }

  @Delete('admin/users/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a user by ID (admin)',
    description: 'Delete a specific user by ID (admin)',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  adminRemoveUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.identityRpcClient.call(new AdminRemoveUserRpcInput({ id, reqUser }));
  }

  //#endregion
}
