import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
import { IdentityService } from './identity.service';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern(PublicCreateUserRpcInput.pattern)
  publicCreateUser(
    @Payload() payload: PublicCreateUserRpcInput['payload'],
  ): Promise<PublicCreateUserRpcInput['response']> {
    return this.identityService.publicCreateUser(
      payload.dto,
      payload.idempotencyKey,
    );
  }

  @MessagePattern(PublicFindMyUserRpcInput.pattern)
  publicFindMyUser(
    @Payload() payload: PublicFindMyUserRpcInput['payload'],
  ): Promise<PublicFindMyUserRpcInput['response']> {
    return this.identityService.publicFindMyUser(payload.reqUser);
  }

  @MessagePattern(PublicFindOneUserRpcInput.pattern)
  publicFindOneUser(
    @Payload() payload: PublicFindOneUserRpcInput['payload'],
  ): Promise<PublicFindOneUserRpcInput['response']> {
    return this.identityService.publicFindOneUser(payload.id);
  }

  @MessagePattern(PublicFindAllUsersRpcInput.pattern)
  publicFindAllUsers(
    @Payload() payload: PublicFindAllUsersRpcInput['payload'],
  ): Promise<PublicFindAllUsersRpcInput['response']> {
    return this.identityService.publicFindAllUsers(payload.query);
  }

  @MessagePattern(PublicUpdateUserRpcInput.pattern)
  publicUpdateUser(
    @Payload() payload: PublicUpdateUserRpcInput['payload'],
  ): Promise<PublicUpdateUserRpcInput['response']> {
    return this.identityService.publicUpdateUser(payload.dto, payload.reqUser);
  }

  @MessagePattern(PublicRemoveMyUserRpcInput.pattern)
  publicRemoveMyUser(
    @Payload() payload: PublicRemoveMyUserRpcInput['payload'],
  ): Promise<PublicRemoveMyUserRpcInput['response']> {
    return this.identityService.publicRemoveMyUser(payload.reqUser);
  }

  @MessagePattern(AdminCreateUserRpcInput.pattern)
  adminCreateUser(
    @Payload() payload: AdminCreateUserRpcInput['payload'],
  ): Promise<AdminCreateUserRpcInput['response']> {
    return this.identityService.adminCreateUser(
      payload.dto,
      payload.idempotencyKey,
      payload.reqUser,
    );
  }

  @MessagePattern(AdminFindAllUsersRpcInput.pattern)
  adminFindAllUsers(
    @Payload() payload: AdminFindAllUsersRpcInput['payload'],
  ): Promise<AdminFindAllUsersRpcInput['response']> {
    return this.identityService.adminFindAllUsers(payload.query);
  }

  @MessagePattern(AdminFindOneUserRpcInput.pattern)
  adminFindOneUser(
    @Payload() payload: AdminFindOneUserRpcInput['payload'],
  ): Promise<AdminFindOneUserRpcInput['response']> {
    return this.identityService.adminFindOneUser(payload.id);
  }

  @MessagePattern(AdminUpdateUserRpcInput.pattern)
  adminUpdateUser(
    @Payload() payload: AdminUpdateUserRpcInput['payload'],
  ): Promise<AdminUpdateUserRpcInput['response']> {
    return this.identityService.adminUpdateUser(
      payload.id,
      payload.dto,
      payload.reqUser,
    );
  }

  @MessagePattern(AdminRemoveUserRpcInput.pattern)
  adminRemoveUser(
    @Payload() payload: AdminRemoveUserRpcInput['payload'],
  ): Promise<AdminRemoveUserRpcInput['response']> {
    return this.identityService.adminRemoveUser(payload.id, payload.reqUser);
  }

  @MessagePattern(PublicLoginRpcInput.pattern)
  publicLogin(
    @Payload() payload: PublicLoginRpcInput['payload'],
  ): Promise<PublicLoginRpcInput['response']> {
    return this.identityService.publicLogin(payload.email, payload.password);
  }

  @MessagePattern(PublicRefreshRpcInput.pattern)
  publicRefreshSession(
    @Payload() payload: PublicRefreshRpcInput['payload'],
  ): Promise<PublicRefreshRpcInput['response']> {
    return this.identityService.publicRefreshSession(payload.reqUser);
  }

  @MessagePattern(PublicLogoutRpcInput.pattern)
  publicLogout(
    @Payload() payload: PublicLogoutRpcInput['payload'],
  ): Promise<PublicLogoutRpcInput['response']> {
    return this.identityService.publicLogout(payload.reqUser);
  }
}
