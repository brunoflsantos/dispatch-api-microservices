import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseEventInput } from 'libs/common/modules/transport/dto/base.input';
import { EVENT_BUS_CLIENT } from '../constants/client-proxies.tokens';

@Injectable()
export class EventEmitter {
  constructor(@Inject(EVENT_BUS_CLIENT) private readonly client: ClientProxy) {}

  emit<T extends BaseEventInput>(eventInput: T): void {
    this.client.emit(eventInput.pattern, eventInput.payload).subscribe();
  }
}
