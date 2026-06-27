import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADDRESS_REPOSITORY,
  USER_REPOSITORY,
  USERS_SERVICE,
} from '../../constants/identity.token';

import { CacheModule } from 'libs/common/modules/cache/cache.module';
import { DbGuardModule } from 'libs/common/modules/db-guard/db-guard.module';
import { OutboxModule } from 'libs/common/modules/outbox/outbox.module';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { AddressRepository } from './providers/address.repository';
import { UserRepository } from './providers/user.repository';
import { UsersSeedService } from './providers/users-seed.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address]),

    DbGuardModule,

    CacheModule,

    OutboxModule,
  ],
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ADDRESS_REPOSITORY,
      useClass: AddressRepository,
    },
    UsersSeedService,
  ],
  exports: [USERS_SERVICE, USER_REPOSITORY, ADDRESS_REPOSITORY],
})
export class UsersModule {}
