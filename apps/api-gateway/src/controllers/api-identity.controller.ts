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
import { UserRole } from 'libs/common/enums/user-role.enum';
import { JwtRefreshAuthGuard } from 'libs/common/guards/jwt-refresh.guard';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import {
  AdminCreateUserContractMethod,
  AdminFindAllUsersContractMethod,
  AdminFindOneUserContractMethod,
  AdminRemoveUserContractMethod,
  AdminUpdateUserContractMethod,
  PublicCreateUserContractMethod,
  PublicFindAllUsersContractMethod,
  PublicFindMyUserContractMethod,
  PublicFindOneUserContractMethod,
  PublicLoginContractMethod,
  PublicLogoutContractMethod,
  PublicRefreshContractMethod,
  PublicRemoveMyUserContractMethod,
  PublicUpdateUserContractMethod,
} from 'libs/contracts/messaging/identity-contracts';
import { CreateUserDto, PublicCreateUserDto } from '../dto/identity/create-user.dto';
import { LoginDto } from '../dto/identity/login.dto';
import { PublicUpdateUserDto, UpdateUserDto } from '../dto/identity/update-user.dto';
import { PublicUserQueryDto, UserQueryDto } from '../dto/identity/user-query.dto';
import { ApiIdentityService } from '../services/api-identity.service';

@Controller('identity')
@ApiTags('identity')
@ApiBearerAuth()
export class ApiIdentityController extends BaseController {
  constructor(private readonly apiIdentityService: ApiIdentityService) {
    super(ApiIdentityController.name);
  }

  //#region Auth

  @Public()
  @Post('public/auth/login')
  publicLogin(@Body() dto: LoginDto) {
    return this.apiIdentityService.sendMessage(
      new PublicLoginContractMethod({ email: dto.email, password: dto.password }),
    );
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('public/auth/refresh')
  publicRefreshSession(@GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new PublicRefreshContractMethod({ reqUser }),
    );
  }

  @Post('public/auth/logout')
  publicLogout(@GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new PublicLogoutContractMethod({ reqUser }),
    );
  }

  //#endregion

  //#region Users - Public

  @Public()
  @Post('public/users')
  publicCreateUser(
    @Body() dto: PublicCreateUserDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.apiIdentityService.sendMessage(
      new PublicCreateUserContractMethod({ dto, idempotencyKey }),
    );
  }

  @Get('public/users/me')
  publicFindMyUser(@GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new PublicFindMyUserContractMethod({ reqUser }),
    );
  }

  @Public()
  @Get('public/users/:id')
  publicFindOneUser(@Param('id') id: string) {
    return this.apiIdentityService.sendMessage(
      new PublicFindOneUserContractMethod({ id }),
    );
  }

  @Public()
  @Get('public/users')
  publicFindAllUsers(@Query() query: PublicUserQueryDto) {
    return this.apiIdentityService.sendMessage(
      new PublicFindAllUsersContractMethod({ query }),
    );
  }

  @Put('public/users/me')
  publicUpdateUser(
    @Body() dto: PublicUpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.apiIdentityService.sendMessage(
      new PublicUpdateUserContractMethod({ dto, reqUser }),
    );
  }

  @Delete('public/users/me')
  publicRemoveMyUser(@GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new PublicRemoveMyUserContractMethod({ reqUser }),
    );
  }

  //#endregion

  //#region Users - Admin

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post('admin/users')
  adminCreateUser(
    @Body() dto: CreateUserDto,
    @GetUser() reqUser: RequestUser,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.apiIdentityService.sendMessage(
      new AdminCreateUserContractMethod({ dto, idempotencyKey, reqUser }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get('admin/users')
  adminFindAllUsers(@Query() query: UserQueryDto, @GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new AdminFindAllUsersContractMethod({ query, reqUser }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get('admin/users/:id')
  adminFindOneUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new AdminFindOneUserContractMethod({ id, reqUser }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Put('admin/users/:id')
  adminUpdateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() reqUser: RequestUser,
  ) {
    return this.apiIdentityService.sendMessage(
      new AdminUpdateUserContractMethod({ id, dto, reqUser }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Delete('admin/users/:id')
  adminRemoveUser(@Param('id') id: string, @GetUser() reqUser: RequestUser) {
    return this.apiIdentityService.sendMessage(
      new AdminRemoveUserContractMethod({ id, reqUser }),
    );
  }

  //#endregion
}
