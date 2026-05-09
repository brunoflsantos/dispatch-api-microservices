import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_TTL } from 'libs/common/constants/cache-ttl.constant';
import { LOCK_KEYS } from 'libs/common/constants/lock-keys.constant';
import { CacheService } from 'libs/common/modules/cache/cache.service';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { IdempotencyService } from 'libs/common/modules/cache/idempotency.service';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { runAndIgnoreError, template } from 'libs/common/utils/functions.utils';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { CreateProductRequestContract } from 'libs/contracts/interfaces/products/create-product-request.interface';
import { ProductQueryRequestContract } from 'libs/contracts/interfaces/products/product-query-request.interface';
import {
  ProductResponseContract,
  PublicProductResponseContract,
} from 'libs/contracts/interfaces/products/product-response.interface';
import { UpdateProductRequestContract } from 'libs/contracts/interfaces/products/update-product-request.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import { PRODUCT_REPOSITORY } from './constants/catalog.token';
import { I18N_CATALOG } from './constants/i18n.constant';
import {
  ProductResponseDto,
  PublicProductResponseDto,
} from './dto/product-response.dto';
import { ICatalogService } from './interfaces/catalog-service.interface';
import type { IProductRepository } from './interfaces/product-repository.interface';

@Injectable()
export class CatalogService extends BaseService implements ICatalogService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly cacheService: CacheService,
    private readonly idempotencyService: IdempotencyService,
    private readonly guard: DbGuardService,
  ) {
    super(CatalogService.name);
  }

  //#region Products - Public

  async publicFindAllProducts(
    query: ProductQueryRequestContract,
  ): Promise<PagOffsetResultDto<PublicProductResponseContract>> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL(query);
    const cachedResult = await runAndIgnoreError(
      () =>
        this.cacheService.get<PagOffsetResultDto<PublicProductResponseDto>>(
          cacheKey,
        ),
      `fetching product list from cache with key: ${cacheKey}`,
      this.logger,
    );
    if (cachedResult) {
      this.logger.debug('Returning cached product list', { cacheKey });
      return cachedResult;
    }

    const result = await this.productRepository.filter(query);
    const resultMapped = new PagOffsetResultDto<PublicProductResponseDto>(
      result.meta.total,
      result.meta.page,
      result.meta.limit,
      EntityMapper.mapArray(result.items, PublicProductResponseDto),
    );

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, resultMapped, CACHE_TTL.LIST),
      `caching product list with key: ${cacheKey}`,
      this.logger,
    );

    this.logger.debug(`Retrieved ${result.items.length} products`, { cacheKey });

    return resultMapped;
  }

  async publicFindOneProduct(id: string): Promise<PublicProductResponseContract> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ONE(id);
    const cachedResult = await runAndIgnoreError(
      () => this.cacheService.get<PublicProductResponseDto>(cacheKey),
      `fetching product from cache with key: ${cacheKey}`,
      this.logger,
    );
    if (cachedResult) {
      this.logger.debug('Returning cached product', { id });
      return cachedResult;
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }
    const productMapped = EntityMapper.map(product, PublicProductResponseDto);

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, productMapped, CACHE_TTL.LIST),
      `caching product with ID: ${id}`,
      this.logger,
    );

    return productMapped;
  }

  //#endregion

  //#region Products - Admin

  adminCreateProduct(
    dto: CreateProductRequestContract,
    idempotencyKey: string,
  ): Promise<ProductResponseContract> {
    return this.guard.lockAndTransaction(
      LOCK_KEYS.PRODUCTS.CREATE(idempotencyKey),
      async () =>
        this.idempotencyService.getOrExecute(
          CACHE_KEYS.PRODUCTS.IDEMPOTENCY('create', idempotencyKey),
          () => this._adminCreateProduct(dto),
        ),
    );
  }

  private async _adminCreateProduct(
    dto: CreateProductRequestContract,
  ): Promise<ProductResponseContract> {
    const product = this.productRepository.createEntity(dto);
    const savedProduct = await this.productRepository.save(product);
    const productResponse = EntityMapper.map(savedProduct, ProductResponseDto);

    await this.cacheService.deleteBulk({
      patterns: [CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL_PATTERN()],
    });

    this.logger.debug('Product created', {
      productId: savedProduct.id,
    });

    return productResponse;
  }

  async adminFindAllProducts(
    query: ProductQueryRequestContract,
  ): Promise<PagOffsetResultDto<ProductResponseContract>> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL(query);
    const cachedResult = await runAndIgnoreError(
      () => this.cacheService.get<PagOffsetResultDto<ProductResponseDto>>(cacheKey),
      `fetching product list from cache with key: ${cacheKey}`,
      this.logger,
    );
    if (cachedResult) {
      this.logger.debug('Returning cached product list', { cacheKey });
      return cachedResult;
    }

    const result = await this.productRepository.filter(query);
    const resultMapped = new PagOffsetResultDto<ProductResponseDto>(
      result.meta.total,
      result.meta.page,
      result.meta.limit,
      EntityMapper.mapArray(result.items, ProductResponseDto),
    );

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, resultMapped, CACHE_TTL.LIST),
      `caching product list with key: ${cacheKey}`,
      this.logger,
    );

    this.logger.debug(`Retrieved ${result.items.length} products`, { cacheKey });

    return resultMapped;
  }

  async adminFindOneProduct(id: string): Promise<ProductResponseContract> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ONE(id);
    const cachedResult = await runAndIgnoreError(
      () => this.cacheService.get<ProductResponseDto>(cacheKey),
      `fetching product from cache with key: ${cacheKey}`,
      this.logger,
    );
    if (cachedResult) {
      this.logger.debug('Returning cached product', { id });
      return cachedResult;
    }

    this.logger.debug('Fetching product', { productId: id });

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }
    const productMapped = EntityMapper.map(product, ProductResponseDto);

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, productMapped, CACHE_TTL.LIST),
      `caching product with ID: ${id}`,
      this.logger,
    );

    return productMapped;
  }

  adminUpdateProduct(
    id: string,
    dto: UpdateProductRequestContract,
  ): Promise<ProductResponseContract> {
    return this.guard.lockAndTransaction(LOCK_KEYS.PRODUCTS.UPDATE(id), async () =>
      this._adminUpdateProduct(id, dto),
    );
  }

  private async _adminUpdateProduct(
    id: string,
    dto: UpdateProductRequestContract,
  ): Promise<ProductResponseContract> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }

    Object.assign(product, dto);
    const savedProduct = await this.productRepository.save(product);

    this.logger.debug('Product updated', { productId: savedProduct.id });

    await this.cacheService.deleteBulk({
      keys: [CACHE_KEYS.PRODUCTS.CACHE_FIND_ONE(id)],
      patterns: [CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL_PATTERN()],
    });

    return EntityMapper.map(savedProduct, ProductResponseDto);
  }

  adminRemoveProduct(id: string): Promise<void> {
    return this.guard.lockAndTransaction(LOCK_KEYS.PRODUCTS.REMOVE(id), async () =>
      this._adminRemoveProduct(id),
    );
  }

  private async _adminRemoveProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }

    await this.productRepository.softRemove(product);

    await this.cacheService.deleteBulk({
      keys: [CACHE_KEYS.PRODUCTS.CACHE_FIND_ONE(id)],
      patterns: [CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL_PATTERN()],
    });

    this.logger.debug('Product deactivated', { productId: id });
  }

  //#endregion

  //#region Products - Misc

  async findManyProductsByIds(ids: string[]): Promise<ProductResponseContract[]> {
    const result = await this.productRepository.findManyByIds(ids);
    return EntityMapper.mapArray(result, ProductResponseDto);
  }

  async decrementProductStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }
    if (product.stock < quantity) {
      throw new ForbiddenException(
        template(I18N_CATALOG.ERRORS.INSUFFICIENT_STOCK, {
          productName: product.name,
        }),
      );
    }
    return this.guard.lockAndTransaction(
      LOCK_KEYS.PRODUCTS.UPDATE(product.id),
      async () => this.productRepository.decrementStock(product, quantity),
    );
  }

  async incrementProductStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }
    return this.guard.lockAndTransaction(
      LOCK_KEYS.PRODUCTS.UPDATE(product.id),
      async () => this.productRepository.incrementStock(product, quantity),
    );
  }

  async validateAndGetCatalogProducts(
    ids: string[],
  ): Promise<ProductResponseContract[]> {
    const products = await this.findManyProductsByIds(ids);
    // Validate all products exist in catalog
    for (const id of ids) {
      if (!products.find((ci) => ci.id === id)) {
        throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
      }
    }
    return products;
  }

  //#endregion
}
