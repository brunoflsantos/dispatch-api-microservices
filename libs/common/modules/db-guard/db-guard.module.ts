import { Module } from '@nestjs/common';
import { DbGuardService } from './db-guard.service';

@Module({
  exports: [DbGuardService],
  providers: [DbGuardService],
})
export class DbGuardModule {}
