import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { join, resolve } from 'path';
import { typeOrmNotificationsConfig } from './config/orm.notifications.config';
import {
  NOTIFICATION_REPOSITORY,
  NOTIFICATIONS_SERVICE,
} from './constants/notifications.token';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './providers/notification.repository';

@Module({
  imports: [
    ModuleImportsFactory.createConfigModule({
      envFilePath: resolve(
        process.cwd(),
        `apps/notifications/.env.${process.env.NODE_ENV || 'local'}`,
      ),
    }),

    ModuleImportsFactory.createLoggerModule(),

    ModuleImportsFactory.createTypeOrmModule(typeOrmNotificationsConfig),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NOTIFICATIONS_SERVICE,
      useClass: NotificationsService,
    },
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
  ],
})
export class NotificationsModule {}
