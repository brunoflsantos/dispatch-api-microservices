import { ensureError } from '@/shared/utils/functions.utils';
import { RequestContext } from '@/shared/utils/request-context.utils';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { Outbox } from '../../entities/outbox.entity';
import { OUTBOX_REPOSITORY } from './constants/outbox.token';
import type { IOutboxRepository } from './interfaces/outbox-repository.interface';
import { IOutboxService } from './interfaces/outbox-service.interface';

import { BaseService } from 'libs/contracts/services/base.service';
import { DbGuardService } from '../db-guard/db-guard.service';
import { BaseEventInput } from '../transport/dto/base.input';
import { EventEmitter } from '../transport/providers/event-emitter';

@Injectable()
export class OutboxService
  extends BaseService
  implements OnModuleDestroy, IOutboxService
{
  private isProcessing = false;

  private isShuttingDown = false;

  constructor(
    @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: IOutboxRepository,
    private readonly eventEmitter: EventEmitter,
    private readonly guard: DbGuardService,
  ) {
    super(OutboxService.name);
  }

  async onModuleDestroy(): Promise<void> {
    // Wait until any ongoing processing is finished before allowing shutdown to proceed
    this.isShuttingDown = true;
    while (this.isProcessing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  process(): Promise<void> {
    return this.guard.transaction(() => this._process());
  }

  private async _process() {
    if (this.isShuttingDown || this.isProcessing) {
      // Outbox is already being processed or shutting down, skip this cycle
      return;
    }
    this.isProcessing = true;

    try {
      const limit = 100;
      const messages = await this.outboxRepository.findAndLockBatch(limit);
      if (messages.length === 0) return;

      await this.dispatch(messages);

      const dispatchedIds: string[] = messages.map((m) => m.id);
      await this.outboxRepository.deleteBulk(dispatchedIds);

      this.logger.log(
        `Successfully processed batch of ${messages.length} Outbox messages.`,
      );

      // Controlled recursion: If we reached the maximum limit, schedule the next
      // execution immediately
      if (messages.length === limit) {
        setImmediate(() => void this.process());
        return;
      }
    } catch (e) {
      const error = ensureError(e);
      this.logger.error('Error during Outbox processing cycle', {
        cause: error,
      });
    } finally {
      this.isProcessing = false; // Release the lock for the next execution
    }
  }

  async add<T extends BaseEventInput>(outboxPayload: T): Promise<void> {
    const correlationId = RequestContext.getCorrelationId() ?? randomUUID();
    const outboxEntry = this.outboxRepository.createEntity({
      payload: outboxPayload,
      correlationId,
    });
    await this.outboxRepository.save(outboxEntry);

    // Trigger immediate processing after adding a new message to the outbox
    setImmediate(() => void this.process());
  }

  private async dispatch(messages: Outbox[]): Promise<void> {
    if (messages.length === 0) return;

    await Promise.all(
      messages.map((message) =>
        Promise.resolve(this.eventEmitter.emit(message.payload)),
      ),
    );
  }
}
