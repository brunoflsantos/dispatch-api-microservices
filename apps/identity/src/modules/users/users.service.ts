import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'libs/common/enums/role.enum';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { LOCK_KEYS } from 'libs/common/modules/cache/constants/lock-keys.constant';
import { IdempotencyService } from 'libs/common/modules/cache/providers/idempotency.service';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { OUTBOX_SERVICE } from 'libs/common/modules/outbox/constants/outbox.token';
import type { IOutboxService } from 'libs/common/modules/outbox/interfaces/outbox-service.interface';
import {
  UserCreatedEventInput,
  UserDeletedEventInput,
  UserUpdatedEventInput,
} from 'libs/common/modules/transport/dto/identity-event.input';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { template } from 'libs/common/utils/functions.utils';
import { HashAdapter } from 'libs/common/utils/hash-adapter.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import {
  CreateUserInput,
  PublicCreateUserInput,
} from 'libs/contracts/interfaces/users/create-user-input.interface';
import {
  PublicUpdateUserInput,
  UpdateUserInput,
} from 'libs/contracts/interfaces/users/update-user-input.interface';
import {
  PublicUserCursorQueryInput,
  UserCursorQueryInput,
} from 'libs/contracts/interfaces/users/user-cursor-query-input.interface';
import {
  PublicUserResult,
  UserResult,
  UserSelfResult,
} from 'libs/contracts/interfaces/users/user-result.interface';
import { BaseService } from 'libs/contracts/services/base.service';

import { PublicUserResponseDto } from 'apps/api-gateway/src/dto/identity/user-response.dto';
import { I18N_IDENTITY } from '../../constants/i18n.constant';
import { ADDRESS_REPOSITORY, USER_REPOSITORY } from '../../constants/identity.token';
import { UserAddressResponseDto } from './dto/user-address-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserSelfResponseDto } from './dto/user-self-response.dto';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { assertRoleWriteAccess, assertWriteAccess } from './helpers/assert.helper';
import type { IAddressRepository } from './interfaces/address-repository.interface';
import type { IUserRepository } from './interfaces/user-repository.interface';
import { IUsersService } from './interfaces/users-service.interface';

@Injectable()
export class UsersService extends BaseService implements IUsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
    @Inject(OUTBOX_SERVICE)
    private readonly outboxService: IOutboxService,
    private readonly idempotencyService: IdempotencyService,
    private readonly guard: DbGuardService,
  ) {
    super(UsersService.name);
  }

  //#region Users - Public

  publicCreate(
    dto: PublicCreateUserInput,
    idempotencyKey: string,
  ): Promise<UserSelfResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.USERS.CREATE(idempotencyKey),
      () =>
        this.idempotencyService.getOrExecute(
          CACHE_KEYS.USERS.IDEMPOTENCY('create', idempotencyKey),
          () => this._publicCreate(dto),
        ),
    );
  }

  private async _publicCreate(dto: PublicCreateUserInput): Promise<UserSelfResult> {
    await this.validateEmail(dto.email);

    const user = this.userRepository.createEntity({
      name: dto.name,
      email: dto.email,
      language: dto.language || 'en',
      password: await HashAdapter.hash(dto.password),
    });
    const saved = await this.userRepository.save(user);
    const userMapped = EntityMapper.map(saved, UserSelfResponseDto);

    // Expected side effects: create customer in payments gateway
    await this.outboxService.add(
      new UserCreatedEventInput({
        userId: saved.id,
        email: saved.email,
        name: saved.name,
        idempotencyKey: crypto.randomUUID(),
      }),
    );

    this.logger.debug('User created', {
      userId: saved.id,
    });

    return userMapped;
  }

  async publicFindMe(requestUser: RequestUser): Promise<UserSelfResult> {
    const user = await this.getUserOrThrow(requestUser.id);
    const address = await this.addressRepository.findOne({
      where: { userId: user.id },
    });

    const userMapped = EntityMapper.map(user, UserSelfResponseDto);
    if (address) {
      userMapped.address = EntityMapper.map(address, UserAddressResponseDto);
    }

    this.logger.debug('Retrieved user profile', { userId: userMapped.id });

    return userMapped;
  }

  async publicFindOne(id: string): Promise<PublicUserResult> {
    const user = await this.getUserOrThrow(id);

    this.logger.debug('Retrieved customer data from payments gateway', {
      userId: user.id,
      customerId: user.customerId,
    });

    const userMapped = EntityMapper.map(user, PublicUserResponseDto);

    this.logger.debug('User found', { userId: userMapped.id });

    return userMapped;
  }

  async publicFindAll(
    query: PublicUserCursorQueryInput,
  ): Promise<PagCursorResultDto<PublicUserResult>> {
    const result = await this.userRepository.filter(query);

    const resultMapped = new PagCursorResultDto<PublicUserResponseDto>(
      EntityMapper.mapArray(result.items, PublicUserResponseDto),
      result.nextCursor,
      result.hasMore,
    );

    this.logger.debug(`Retrieved ${result.items.length} users with public query`, {
      query,
    });

    return resultMapped;
  }

  publicUpdate(
    dto: PublicUpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserSelfResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.USERS.UPDATE(requestUser.id),
      () => this._publicUpdate(dto, requestUser),
    );
  }

  private async _publicUpdate(
    dto: PublicUpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserSelfResult> {
    const user = await this.getUserOrThrow(requestUser.id);

    const oldEmail = user.email;
    const newEmail = dto.email;
    if (newEmail && newEmail !== oldEmail) {
      await this.validateEmail(newEmail);
    }

    let address = await this.ensureAddress(user.id);

    if (dto.address) {
      Object.assign(address, dto.address);
      address = await this.addressRepository.save(address);
    }

    Object.assign(user, dto);
    const updatedUser = await this.userRepository.save(user);

    // Expected side effects: update customer in payments gateway
    await this.outboxService.add(
      new UserUpdatedEventInput({
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      }),
    );

    this.logger.debug(`User updated successfully: ${updatedUser.id}`);

    const userMapped = EntityMapper.map(updatedUser, UserSelfResponseDto);
    if (dto.address) {
      userMapped.address = EntityMapper.map(address, UserAddressResponseDto);
    }

    return userMapped;
  }

  publicRemoveMe(requestUser: RequestUser): Promise<void> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.USERS.REMOVE(requestUser.id),
      () => this._publicRemoveMe(requestUser),
    );
  }

  private async _publicRemoveMe(requestUser: RequestUser): Promise<void> {
    const user = await this.getUserOrThrow(requestUser.id);

    assertWriteAccess(user, requestUser);

    await this.userRepository.softRemove(user);

    // Expected side effects: delete customer in payments gateway
    await this.outboxService.add(
      new UserDeletedEventInput({
        userId: user.id,
      }),
    );

    this.logger.debug(`User removed successfully: ${user.id}`);
  }

  //#endregion

  //#region Users - Admin

  adminCreate(
    dto: CreateUserInput,
    idempotencyKey: string,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.USERS.CREATE(idempotencyKey),
      () =>
        this.idempotencyService.getOrExecute(
          CACHE_KEYS.USERS.IDEMPOTENCY('create', idempotencyKey),
          () => this._adminCreate(dto, requestUser),
        ),
    );
  }

  private async _adminCreate(
    dto: CreateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    await this.validateEmail(dto.email);

    assertRoleWriteAccess(dto.role, requestUser);

    const user = this.userRepository.createEntity({
      name: dto.name,
      email: dto.email,
      password: await HashAdapter.hash(dto.password),
      language: dto.language || 'en',
      role: dto.role || Role.USER,
    });
    const saved = await this.userRepository.save(user);
    const userMapped = EntityMapper.map(saved, UserResponseDto);

    // Expected side effects: create customer in payments gateway
    await this.outboxService.add(
      new UserCreatedEventInput({
        userId: saved.id,
        email: saved.email,
        name: saved.name,
        idempotencyKey: crypto.randomUUID(),
      }),
    );

    this.logger.debug('User created', {
      userId: saved.id,
    });

    return userMapped;
  }

  async adminFindAll(
    query: UserCursorQueryInput,
  ): Promise<PagCursorResultDto<UserResult>> {
    const result = await this.userRepository.filter(query);

    const resultMapped = new PagCursorResultDto<UserResponseDto>(
      EntityMapper.mapArray(result.items, UserResponseDto),
      result.nextCursor,
      result.hasMore,
    );

    this.logger.debug(`Retrieved ${result.items.length} users`);

    return resultMapped;
  }

  async adminFindOne(id: string): Promise<UserResult> {
    const user = await this.getUserOrThrow(id);
    const address = await this.addressRepository.findOne({
      where: { userId: user.id },
    });

    const userMapped = EntityMapper.map(user, UserResponseDto);
    if (address) {
      userMapped.address = EntityMapper.map(address, UserAddressResponseDto);
    }

    this.logger.debug('User found', { id: userMapped.id });

    return userMapped;
  }

  adminUpdate(
    id: string,
    dto: UpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    return this.guard.lockAndTransaction(LOCK_KEYS.USERS.UPDATE(id), () =>
      this._adminUpdate(id, dto, requestUser),
    );
  }

  private async _adminUpdate(
    id: string,
    dto: UpdateUserInput,
    requestUser: RequestUser,
  ): Promise<UserResult> {
    const user = await this.getUserOrThrow(id);

    const oldEmail = user.email;
    const newEmail = dto.email;
    if (newEmail && newEmail !== oldEmail) {
      await this.validateEmail(newEmail);
    }
    assertWriteAccess(user, requestUser);

    let address = await this.ensureAddress(user.id);

    if (dto.address) {
      Object.assign(address, dto.address);
      address = await this.addressRepository.save(address);
    }

    Object.assign(user, dto);
    const updated = await this.userRepository.save(user);

    // Expected side effects: update customer in payments gateway
    await this.outboxService.add(
      new UserUpdatedEventInput({
        userId: updated.id,
        email: updated.email,
        name: updated.name,
      }),
    );

    this.logger.debug(`User updated successfully: ${updated.id}`);

    const userMapped = EntityMapper.map(updated, UserResponseDto);
    if (dto.address) {
      userMapped.address = EntityMapper.map(address, UserAddressResponseDto);
    }

    return userMapped;
  }

  adminRemove(id: string, requestUser: RequestUser): Promise<void> {
    return this.guard.lockAndTransaction(LOCK_KEYS.USERS.REMOVE(id), () =>
      this._adminRemove(id, requestUser),
    );
  }

  private async _adminRemove(id: string, requestUser: RequestUser): Promise<void> {
    const user = await this.getUserOrThrow(id);

    assertWriteAccess(user, requestUser);

    await this.userRepository.softRemove(user);

    // Expected side effects: delete customer in payments gateway
    await this.outboxService.add(
      new UserDeletedEventInput({
        userId: user.id,
      }),
    );

    this.logger.debug('User removed successfully', { userId: id });
  }

  //#endregion

  //#region Private methods

  private async validateEmail(email: string) {
    const emailExists = await this.userRepository.existsBy({
      where: { email },
    });
    if (emailExists) {
      throw new ConflictException(
        template(I18N_IDENTITY.ERRORS.EMAIL_ALREADY_EXISTS, { email }),
      );
    }
  }

  private async getUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(template(I18N_IDENTITY.ERRORS.USER_NOT_FOUND));
    }
    return user;
  }

  private async ensureAddress(userId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { userId },
    });
    return address ?? new Address();
  }

  //#endregion
}
