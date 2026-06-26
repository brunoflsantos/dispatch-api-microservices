import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from '../../entities/outbox.entity';
import { DbGuardModule } from '../db-guard/db-guard.module';
import { TransportModule } from '../transport/transport.module';
import { OUTBOX_REPOSITORY, OUTBOX_SERVICE } from './constants/outbox.token';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from './repositories/outbox.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ScheduleModule.forRoot(),
    DbGuardModule,
    TransportModule,
  ],
  providers: [
    { provide: OUTBOX_SERVICE, useClass: OutboxService },
    { provide: OUTBOX_REPOSITORY, useClass: OutboxRepository },
  ],
  exports: [OUTBOX_SERVICE],
})
export class OutboxModule {}
