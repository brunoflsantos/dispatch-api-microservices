import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { CacheModule } from 'libs/common/modules/cache/cache.module';
import { DbGuardModule } from 'libs/common/modules/db-guard/db-guard.module';
import { TransportModule } from 'libs/common/modules/transport/transport.module';
import { join, resolve } from 'path';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { typeOrmCatalogConfig } from './config/orm.catalog.config';
import { CATALOG_SERVICE, PRODUCT_REPOSITORY } from './constants/catalog.token';
import { Product } from './entities/product.entity';
import { ProductRepository } from './providers/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),

    ModuleImportsFactory.createConfigModule({
      envFilePath: resolve(
        process.cwd(),
        `apps/catalog/.env.${process.env.NODE_ENV || 'local'}`,
      ),
    }),

    ModuleImportsFactory.createLoggerModule(),

    ModuleImportsFactory.createTypeOrmModule(typeOrmCatalogConfig),

    ModuleImportsFactory.createI18nModule({
      translationsPath: join(__dirname, '/i18n/'),
    }),

    DbGuardModule,

    CacheModule,

    TransportModule,
  ],
  controllers: [CatalogController],
  providers: [
    { provide: CATALOG_SERVICE, useClass: CatalogService },

    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
})
export class CatalogModule {}
