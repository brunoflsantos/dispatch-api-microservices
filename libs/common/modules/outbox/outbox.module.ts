import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from '../../entities/outbox.entity';
import { OUTBOX_REPOSITORY, OUTBOX_SERVICE } from './constants/outbox.token';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from './repositories/outbox.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Outbox])],
  providers: [
    { provide: OUTBOX_SERVICE, useClass: OutboxService },
    { provide: OUTBOX_REPOSITORY, useClass: OutboxRepository },
  ],
  exports: [OUTBOX_SERVICE],
})
export class OutboxModule {}
