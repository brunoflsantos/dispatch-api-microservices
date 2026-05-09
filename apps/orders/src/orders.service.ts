import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  create(payload: unknown) {
    return {
      status: 'created',
      payload,
    };
  }
}
