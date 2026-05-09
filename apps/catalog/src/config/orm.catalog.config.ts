import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeOrmCatalogConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('CATALOG_DB_HOST'),
  port: configService.getOrThrow('CATALOG_DB_PORT'),
  username: configService.getOrThrow('CATALOG_DB_USERNAME'),
  password: configService.getOrThrow('CATALOG_DB_PASSWORD'),
  database: configService.getOrThrow('CATALOG_DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('CATALOG_DB_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow('CATALOG_DB_LOGGING') === 'true',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

// For migration commands
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.CATALOG_DB_HOST || 'localhost',
  port: parseInt(process.env.CATALOG_DB_PORT || '5432'),
  username: process.env.CATALOG_DB_USERNAME || 'postgres',
  password: process.env.CATALOG_DB_PASSWORD || 'postgres',
  database: process.env.CATALOG_DB_DATABASE || 'dispatch_db_catalog',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
