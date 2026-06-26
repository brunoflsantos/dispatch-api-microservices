import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { CacheModule } from 'libs/common/modules/cache/cache.module';
import { DbGuardModule } from 'libs/common/modules/db-guard/db-guard.module';
import { OutboxModule } from 'libs/common/modules/outbox/outbox.module';
import { TransportModule } from 'libs/common/modules/transport/transport.module';
import { join, resolve } from 'path';
import {
  ORDER_PRODUCT_REPOSITORY,
  ORDER_REPOSITORY,
  ORDERS_SERVICE,
} from './constants/orders.token';
import { typeOrmOrdersConfig } from './config/orm.orders.config';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderProductRepository } from './providers/order-item.repository';
import { OrderRepository } from './providers/order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),

    ModuleImportsFactory.createConfigModule({
      envFilePath: resolve(
        process.cwd(),
        `apps/orders/.env.${process.env.NODE_ENV || 'local'}`,
      ),
    }),

    ModuleImportsFactory.createLoggerModule(),

    ModuleImportsFactory.createTypeOrmModule(typeOrmOrdersConfig),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),

    CacheModule,

    DbGuardModule,

    OutboxModule,

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
