import { Module } from '@nestjs/common';
import { ModuleImportsFactory } from 'libs/common/factories/module-imports.factory';
import { InternalAuthGuard } from 'libs/common/guards/internal-auth.guard';
import { join, resolve } from 'path';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { typeOrmCatalogConfig } from './config/orm.catalog.config';
import { CATALOG_SERVICE, PRODUCT_REPOSITORY } from './constants/catalog.token';
import { ProductRepository } from './providers/product.repository';

@Module({
  imports: [
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
  ],
  controllers: [CatalogController],
  providers: [
    { provide: CATALOG_SERVICE, useClass: CatalogService },

    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },

    InternalAuthGuard,
  ],
})
export class CatalogModule {}
