import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeOrmPaymentsConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('PAYMENTS_DB_HOST'),
  port: configService.getOrThrow('PAYMENTS_DB_PORT'),
  username: configService.getOrThrow('PAYMENTS_DB_USERNAME'),
  password: configService.getOrThrow('PAYMENTS_DB_PASSWORD'),
  database: configService.getOrThrow('PAYMENTS_DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('PAYMENTS_DB_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow('PAYMENTS_DB_LOGGING') === 'true',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PAYMENTS_DB_HOST || 'localhost',
  port: parseInt(process.env.PAYMENTS_DB_PORT || '5432'),
  username: process.env.PAYMENTS_DB_USERNAME || 'postgres',
  password: process.env.PAYMENTS_DB_PASSWORD || 'postgres',
  database: process.env.PAYMENTS_DB_DATABASE || 'dispatch_db_payments',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
