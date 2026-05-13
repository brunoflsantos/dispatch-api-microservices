import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { TransportModule } from 'libs/common/modules/transport/transport.module';
import { join } from 'path';
import {
  ORDER_PRODUCT_REPOSITORY,
  ORDER_REPOSITORY,
  ORDERS_SERVICE,
} from './constants/orders.token';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderProductRepository } from './providers/order-item.repository';
import { OrderRepository } from './providers/order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),

    TransportModule,
  ],
  controllers: [OrdersController],
  providers: [
    { provide: ORDERS_SERVICE, useClass: OrdersService },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    { provide: ORDER_PRODUCT_REPOSITORY, useClass: OrderProductRepository },
  ],
})
export class OrdersModule {}
