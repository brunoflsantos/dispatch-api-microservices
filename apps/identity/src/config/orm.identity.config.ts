import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeOrmIdentityConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('IDENTITY_DB_HOST'),
  port: configService.getOrThrow('IDENTITY_DB_PORT'),
  username: configService.getOrThrow('IDENTITY_DB_USERNAME'),
  password: configService.getOrThrow('IDENTITY_DB_PASSWORD'),
  database: configService.getOrThrow('IDENTITY_DB_DATABASE'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('IDENTITY_DB_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow('IDENTITY_DB_LOGGING') === 'true',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

// For migration commands
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.IDENTITY_DB_HOST || 'localhost',
  port: parseInt(process.env.IDENTITY_DB_PORT || '5432'),
  username: process.env.IDENTITY_DB_USERNAME || 'postgres',
  password: process.env.IDENTITY_DB_PASSWORD || 'postgres',
  database: process.env.IDENTITY_DB_DATABASE || 'dispatch_db_identity',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
