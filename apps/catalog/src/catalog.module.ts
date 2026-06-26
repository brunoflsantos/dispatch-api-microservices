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
import {
  CART_PRODUCT_REPOSITORY,
  CATALOG_SERVICE,
  PRODUCT_REPOSITORY,
} from './constants/catalog.token';
import { CartProduct } from './entities/cart-product.entity';
import { Product } from './entities/product.entity';
import { CartProductRepository } from './providers/cart-product.repository';
import { ProductRepository } from './providers/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, CartProduct]),

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
    { provide: CART_PRODUCT_REPOSITORY, useClass: CartProductRepository },
  ],
})
export class CatalogModule {}
