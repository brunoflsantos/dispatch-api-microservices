import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
import { IdentityService } from './identity.service';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern(PublicCreateUserContractMethod.message)
  publicCreateUser(
    @Payload() data: typeof PublicCreateUserContractMethod.prototype.payload,
  ): Promise<typeof PublicCreateUserContractMethod.prototype.response> {
    return this.identityService.publicCreateUser(data.dto, data.idempotencyKey);
  }

  @MessagePattern(PublicFindMyUserContractMethod.message)
  publicFindMyUser(
    @Payload() data: typeof PublicFindMyUserContractMethod.prototype.payload,
  ): Promise<typeof PublicFindMyUserContractMethod.prototype.response> {
    return this.identityService.publicFindMyUser(data.reqUser);
  }

  @MessagePattern(PublicFindOneUserContractMethod.message)
  publicFindOneUser(
    @Payload() data: typeof PublicFindOneUserContractMethod.prototype.payload,
  ): Promise<typeof PublicFindOneUserContractMethod.prototype.response> {
    return this.identityService.publicFindOneUser(data.id);
  }

  @MessagePattern(PublicFindAllUsersContractMethod.message)
  publicFindAllUsers(
    @Payload() data: typeof PublicFindAllUsersContractMethod.prototype.payload,
  ): Promise<typeof PublicFindAllUsersContractMethod.prototype.response> {
    return this.identityService.publicFindAllUsers(data.query);
  }

  @MessagePattern(PublicUpdateUserContractMethod.message)
  publicUpdateUser(
    @Payload() data: typeof PublicUpdateUserContractMethod.prototype.payload,
  ): Promise<typeof PublicUpdateUserContractMethod.prototype.response> {
    return this.identityService.publicUpdateUser(data.dto, data.reqUser);
  }

  @MessagePattern(PublicRemoveMyUserContractMethod.message)
  publicRemoveMyUser(
    @Payload() data: typeof PublicRemoveMyUserContractMethod.prototype.payload,
  ): Promise<typeof PublicRemoveMyUserContractMethod.prototype.response> {
    return this.identityService.publicRemoveMyUser(data.reqUser);
  }

  @MessagePattern(AdminCreateUserContractMethod.message)
  adminCreateUser(
    @Payload()
    data: typeof AdminCreateUserContractMethod.prototype.payload,
  ): Promise<typeof AdminCreateUserContractMethod.prototype.response> {
    return this.identityService.adminCreateUser(
      data.dto,
      data.idempotencyKey,
      data.reqUser,
    );
  }

  @MessagePattern(AdminFindAllUsersContractMethod.message)
  adminFindAllUsers(
    @Payload() data: typeof AdminFindAllUsersContractMethod.prototype.payload,
  ): Promise<typeof AdminFindAllUsersContractMethod.prototype.response> {
    return this.identityService.adminFindAllUsers(data.query);
  }

  @MessagePattern(AdminFindOneUserContractMethod.message)
  adminFindOneUser(
    @Payload() data: typeof AdminFindOneUserContractMethod.prototype.payload,
  ): Promise<typeof AdminFindOneUserContractMethod.prototype.response> {
    return this.identityService.adminFindOneUser(data.id);
  }

  @MessagePattern(AdminUpdateUserContractMethod.message)
  adminUpdateUser(
    @Payload()
    data: typeof AdminUpdateUserContractMethod.prototype.payload,
  ): Promise<typeof AdminUpdateUserContractMethod.prototype.response> {
    return this.identityService.adminUpdateUser(data.id, data.dto, data.reqUser);
  }

  @MessagePattern(AdminRemoveUserContractMethod.message)
  adminRemoveUser(
    @Payload() data: typeof AdminRemoveUserContractMethod.prototype.payload,
  ): Promise<typeof AdminRemoveUserContractMethod.prototype.response> {
    return this.identityService.adminRemoveUser(data.id, data.reqUser);
  }

  @MessagePattern(PublicLoginContractMethod.message)
  publicLogin(
    @Payload() data: typeof PublicLoginContractMethod.prototype.payload,
  ): Promise<typeof PublicLoginContractMethod.prototype.response> {
    return this.identityService.publicLogin(data.email, data.password);
  }

  @MessagePattern(PublicRefreshContractMethod.message)
  publicRefreshSession(
    @Payload() data: typeof PublicRefreshContractMethod.prototype.payload,
  ): Promise<typeof PublicRefreshContractMethod.prototype.response> {
    return this.identityService.publicRefreshSession(data.reqUser);
  }

  @MessagePattern(PublicLogoutContractMethod.message)
  publicLogout(
    @Payload() data: typeof PublicLogoutContractMethod.prototype.payload,
  ): Promise<typeof PublicLogoutContractMethod.prototype.response> {
    return this.identityService.publicLogout(data.reqUser);
  }
}
