import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheService } from 'libs/common/modules/cache/cache.service';
import { CACHE_KEYS } from 'libs/common/modules/cache/constants/cache-keys.constant';
import { CACHE_TTL } from 'libs/common/modules/cache/constants/cache-ttl.constant';
import { LOCK_KEYS } from 'libs/common/modules/cache/constants/lock-keys.constant';
import { IdempotencyService } from 'libs/common/modules/cache/providers/idempotency.service';
import { DbGuardService } from 'libs/common/modules/db-guard/db-guard.service';
import { EntityMapper } from 'libs/common/utils/entity-mapper.utils';
import { runAndIgnoreError, template } from 'libs/common/utils/functions.utils';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateOrderProductInput } from 'libs/contracts/interfaces/orders/create-order-product-input.interface';
import { CreateProductInput } from 'libs/contracts/interfaces/products/create-product-input.interface';
import { ProductCursorQueryInput } from 'libs/contracts/interfaces/products/product-cursor-query-input.interface';
import {
  ProductResult,
  PublicProductResult,
} from 'libs/contracts/interfaces/products/product-result.interface';
import { UpdateProductInput } from 'libs/contracts/interfaces/products/update-product-input.interface';
import { BaseService } from 'libs/contracts/services/base.service';
import {
  CART_PRODUCT_REPOSITORY,
  PRODUCT_REPOSITORY,
} from './constants/catalog.token';
import { I18N_CATALOG } from './constants/i18n.constant';
import {
  ProductResponseDto,
  PublicProductResponseDto,
} from './dto/product-response.dto';
import { CartProductStatus } from './enums/cart-product-status.enum';
import type { ICartProductRepository } from './interfaces/cart-product-repository.interface';
import { ICatalogService } from './interfaces/catalog-service.interface';
import type { IProductRepository } from './interfaces/product-repository.interface';

@Injectable()
export class CatalogService extends BaseService implements ICatalogService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CART_PRODUCT_REPOSITORY)
    private readonly cartProductRepository: ICartProductRepository,
    private readonly cacheService: CacheService,
    private readonly idempotencyService: IdempotencyService,
    private readonly guard: DbGuardService,
  ) {
    super(CatalogService.name);
  }

  //#region Products - Public

  async publicFindAllProducts(
    query: ProductCursorQueryInput,
  ): Promise<PagCursorResultDto<PublicProductResult>> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL(query);
    const cachedResult = await runAndIgnoreError(
      () =>
        this.cacheService.get<PagCursorResultDto<PublicProductResponseDto>>(
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
    const resultMapped = new PagCursorResultDto<PublicProductResponseDto>(
      EntityMapper.mapArray(result.items, PublicProductResponseDto),
      result.nextCursor,
      result.hasMore,
    );

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, resultMapped, CACHE_TTL.LIST),
      `caching product list with key: ${cacheKey}`,
      this.logger,
    );

    this.logger.debug(`Retrieved ${result.items.length} products`, { cacheKey });

    return resultMapped;
  }

  async publicFindOneProduct(id: string): Promise<PublicProductResult> {
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
    dto: CreateProductInput,
    idempotencyKey: string,
  ): Promise<ProductResult> {
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
    dto: CreateProductInput,
  ): Promise<ProductResult> {
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
    query: ProductCursorQueryInput,
  ): Promise<PagCursorResultDto<ProductResult>> {
    const cacheKey = CACHE_KEYS.PRODUCTS.CACHE_FIND_ALL(query);
    const cachedResult = await runAndIgnoreError(
      () => this.cacheService.get<PagCursorResultDto<ProductResponseDto>>(cacheKey),
      `fetching product list from cache with key: ${cacheKey}`,
      this.logger,
    );
    if (cachedResult) {
      this.logger.debug('Returning cached product list', { cacheKey });
      return cachedResult;
    }

    const result = await this.productRepository.filter(query);
    const resultMapped = new PagCursorResultDto<ProductResponseDto>(
      EntityMapper.mapArray(result.items, ProductResponseDto),
      result.nextCursor,
      result.hasMore,
    );

    await runAndIgnoreError(
      () => this.cacheService.set(cacheKey, resultMapped, CACHE_TTL.LIST),
      `caching product list with key: ${cacheKey}`,
      this.logger,
    );

    this.logger.debug(`Retrieved ${result.items.length} products`, { cacheKey });

    return resultMapped;
  }

  async adminFindOneProduct(id: string): Promise<ProductResult> {
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

  adminUpdateProduct(id: string, dto: UpdateProductInput): Promise<ProductResult> {
    return this.guard.lockAndTransaction(LOCK_KEYS.PRODUCTS.UPDATE(id), async () =>
      this._adminUpdateProduct(id, dto),
    );
  }

  private async _adminUpdateProduct(
    id: string,
    dto: UpdateProductInput,
  ): Promise<ProductResult> {
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

  //#region Products - Internal/Events

  async findManyProductsByIds(ids: string[]): Promise<ProductResult[]> {
    const result = await this.productRepository.findManyByIds(ids);
    return EntityMapper.mapArray(result, ProductResponseDto);
  }

  async validateAndReserveStock(
    orderProducts: CreateOrderProductInput[],
    reserveId: string,
    userId: string,
  ): Promise<ProductResult[]> {
    // Check if any product is missing
    const products = await this.productRepository.findManyByIds(
      orderProducts.map((p) => p.productId),
    );
    if (orderProducts.length !== products.length) {
      throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
    }

    // Lock items to avoid async remote updates
    return this.guard.lockMany(
      orderProducts.map((p) => LOCK_KEYS.PRODUCTS.UPDATE(p.productId)),
      () =>
        this.guard.transaction(() =>
          this._validateAndReserveStock(orderProducts, reserveId, userId),
        ),
    );
  }

  private async _validateAndReserveStock(
    orderProducts: CreateOrderProductInput[],
    reserveId: string,
    userId: string,
  ): Promise<ProductResult[]> {
    // Check stock availability
    for (const orderProduct of orderProducts) {
      const product = await this.productRepository.findById(orderProduct.productId);
      if (!product) {
        throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
      }
      const cartProducts = await this.cartProductRepository.findAll({
        where: { productId: product.id, status: CartProductStatus.RESERVED },
      });
      const reservedStock = cartProducts.reduce((sum, cp) => sum + cp.quantity, 0);
      if (product.stock - reservedStock < orderProduct.quantity) {
        throw new ForbiddenException(
          template(I18N_CATALOG.ERRORS.INSUFFICIENT_STOCK, {
            productName: product.name,
          }),
        );
      }
    }

    // Reserve stock
    await Promise.all(
      orderProducts.map(async (orderProduct) => {
        const product = await this.productRepository.findById(
          orderProduct.productId,
        );
        if (!product) {
          throw new NotFoundException(template(I18N_CATALOG.ERRORS.NOT_FOUND));
        }
        product.stock -= orderProduct.quantity;
        await this.productRepository.save(product);

        const cartProduct = this.cartProductRepository.createEntity({
          productId: product.id,
          quantity: orderProduct.quantity,
          status: CartProductStatus.RESERVED,
          reserveId,
          userId,
        });
        await this.cartProductRepository.save(cartProduct);

        this.logger.debug('Stock reserved for product', {
          productId: product.id,
          quantity: orderProduct.quantity,
          reserveId,
        });
      }),
    );

    const productsUpdated = await this.productRepository.findManyByIds(
      orderProducts.map((p) => p.productId),
    );

    return EntityMapper.mapArray(productsUpdated, ProductResponseDto);
  }

  async undoStockReservation(reserveId: string): Promise<void> {
    return this.guard.transaction(() => this._undoStockReservation(reserveId));
  }

  private async _undoStockReservation(reserveId: string): Promise<void> {
    const cartProducts = await this.cartProductRepository.findAll({
      where: {
        reserveId,
        // Can undo both RESERVED and PURCHASED in case of order cancellation or
        // payment refund
        status: CartProductStatus.RESERVED || CartProductStatus.PURCHASED,
      },
      relations: ['product'],
    });
    const products = cartProducts.map((cp) => cp.product);

    await this.guard.lockMany(
      products.map((p) => LOCK_KEYS.PRODUCTS.UPDATE(p.id)),
      () =>
        Promise.all(
          cartProducts.map(async (cartProduct) => {
            const product = products.find((p) => p.id === cartProduct.productId);
            if (product) {
              // Give back the stock reserved
              product.stock += cartProduct.quantity;
              await this.productRepository.save(product);
            }
            cartProduct.status = CartProductStatus.CANCELED;
            await this.cartProductRepository.save(cartProduct);

            this.logger.debug('Stock reservation undone for product', {
              productId: cartProduct.productId,
              quantity: cartProduct.quantity,
              reserveId,
            });
          }),
        ),
    );
  }

  async confirmStockReservation(reserveId: string): Promise<void> {
    return this.guard.transaction(() => this._confirmStockReservation(reserveId));
  }

  private async _confirmStockReservation(reserveId: string): Promise<void> {
    const cartProducts = await this.cartProductRepository.findAll({
      where: { reserveId, status: CartProductStatus.RESERVED },
    });

    await Promise.all(
      cartProducts.map(async (cartProduct) => {
        cartProduct.status = CartProductStatus.PURCHASED;
        await this.cartProductRepository.save(cartProduct);

        this.logger.debug('Stock reservation confirmed for product', {
          productId: cartProduct.productId,
          quantity: cartProduct.quantity,
          reserveId,
        });
      }),
    );
  }

  //#endregion
}
