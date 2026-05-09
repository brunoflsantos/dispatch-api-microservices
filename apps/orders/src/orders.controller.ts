import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InternalAuthGuard } from '../../../libs/common/guards/internal-auth.guard';
import { OrdersService } from './orders.service';

@Controller('internal/orders')
@UseGuards(InternalAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() payload: unknown) {
    return this.ordersService.create(payload);
  }
}
