import { Module } from '@nestjs/common';
import { CacheModule } from 'libs/common/modules/cache/cache.module';
import { DbGuardService } from './db-guard.service';

@Module({
  imports: [CacheModule],
  exports: [DbGuardService],
  providers: [DbGuardService],
})
export class DbGuardModule {}
