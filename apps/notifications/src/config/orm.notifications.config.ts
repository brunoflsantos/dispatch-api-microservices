import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeOrmNotificationsConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('NOTIFICATIONS_DB_HOST'),
  port: configService.getOrThrow('NOTIFICATIONS_DB_PORT'),
  username: configService.getOrThrow('NOTIFICATIONS_DB_USERNAME'),
  password: configService.getOrThrow('NOTIFICATIONS_DB_PASSWORD'),
  database: configService.getOrThrow('NOTIFICATIONS_DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('NOTIFICATIONS_DB_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow('NOTIFICATIONS_DB_LOGGING') === 'true',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

// For migration commands
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.NOTIFICATIONS_DB_HOST || 'localhost',
  port: parseInt(process.env.NOTIFICATIONS_DB_PORT || '5432'),
  username: process.env.NOTIFICATIONS_DB_USERNAME || 'postgres',
  password: process.env.NOTIFICATIONS_DB_PASSWORD || 'postgres',
  database: process.env.NOTIFICATIONS_DB_DATABASE || 'dispatch_db_notifications',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
