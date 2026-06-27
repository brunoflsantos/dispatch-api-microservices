import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnApplicationBootstrap } from '@nestjs/common';
import { Role } from 'libs/common/enums/role.enum';
import { HashAdapter } from 'libs/common/utils/hash-adapter.utils';
import { USER_REPOSITORY } from '../../../constants/identity.token';
import type { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersSeedService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.SEED_TEST_DATA !== 'true') return;
    await this.seedAdminUser();
  }

  private async seedAdminUser(): Promise<void> {
    const email = 'joao.silva@email.com';

    const exists = await this.userRepository.existsBy({ where: { email } });
    if (exists) return;

    const user = this.userRepository.createEntity({
      name: 'João Silva',
      email,
      password: await HashAdapter.hash('password123'),
      role: Role.ADMIN,
    });

    await this.userRepository.save(user);
    this.logger.log('Admin user seeded');
  }
}
