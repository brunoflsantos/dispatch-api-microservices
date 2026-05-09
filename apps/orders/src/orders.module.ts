import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { join } from 'path';
import { InternalAuthGuard } from '../../../libs/common/guards/internal-auth.guard';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, InternalAuthGuard],
})
export class OrdersModule {}
