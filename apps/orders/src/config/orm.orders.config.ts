import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeOrmOrdersConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('ORDERS_DB_HOST'),
  port: configService.getOrThrow('ORDERS_DB_PORT'),
  username: configService.getOrThrow('ORDERS_DB_USERNAME'),
  password: configService.getOrThrow('ORDERS_DB_PASSWORD'),
  database: configService.getOrThrow('ORDERS_DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('ORDERS_DB_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow('ORDERS_DB_LOGGING') === 'true',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.ORDERS_DB_HOST || 'localhost',
  port: parseInt(process.env.ORDERS_DB_PORT || '5432'),
  username: process.env.ORDERS_DB_USERNAME || 'postgres',
  password: process.env.ORDERS_DB_PASSWORD || 'postgres',
  database: process.env.ORDERS_DB_DATABASE || 'dispatch_db_orders',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
