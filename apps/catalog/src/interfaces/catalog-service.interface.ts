import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { CreateOrderProductInput } from 'libs/contracts/interfaces/orders/create-order-product-input.interface';
import { CreateProductInput } from 'libs/contracts/interfaces/products/create-product-input.interface';
import { ProductOffsetQueryInput } from 'libs/contracts/interfaces/products/product-offset-query-input.interface';
import {
  ProductResult,
  PublicProductResult,
} from 'libs/contracts/interfaces/products/product-result.interface';
import { UpdateProductInput } from 'libs/contracts/interfaces/products/update-product-input.interface';

export interface ICatalogService extends IBaseService {
  publicFindAllProducts(
    query: ProductOffsetQueryInput,
  ): Promise<PagOffsetResultDto<PublicProductResult>>;

  publicFindOneProduct(id: string): Promise<PublicProductResult>;

  adminCreateProduct(
    dto: CreateProductInput,
    idempotencyKey: string,
  ): Promise<ProductResult>;

  adminFindAllProducts(
    query: ProductOffsetQueryInput,
  ): Promise<PagOffsetResultDto<ProductResult>>;

  adminFindOneProduct(id: string): Promise<ProductResult>;

  adminUpdateProduct(id: string, dto: UpdateProductInput): Promise<ProductResult>;

  adminRemoveProduct(id: string): Promise<void>;

  findManyProductsByIds(ids: string[]): Promise<ProductResult[]>;

  validateAndReserveStock(
    orderProducts: CreateOrderProductInput[],
    reserveId: string,
    userId: string,
  ): Promise<ProductResult[]>;

  undoStockReservation(reserveId: string): Promise<void>;

  confirmStockReservation(reserveId: string): Promise<void>;
}
