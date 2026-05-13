import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { CreateProductInput } from 'libs/contracts/interfaces/products/create-product-input.interface';
import { ProductQueryInput } from 'libs/contracts/interfaces/products/product-query-input.interface';
import {
  ProductResult,
  PublicProductResult,
} from 'libs/contracts/interfaces/products/product-result.interface';
import { UpdateProductInput } from 'libs/contracts/interfaces/products/update-product-input.interface';

export interface ICatalogService extends IBaseService {
  publicFindAllProducts(
    query: ProductQueryInput,
  ): Promise<PagOffsetResultDto<PublicProductResult>>;

  publicFindOneProduct(id: string): Promise<PublicProductResult>;

  adminCreateProduct(
    dto: CreateProductInput,
    idempotencyKey: string,
  ): Promise<ProductResult>;

  adminFindAllProducts(
    query: ProductQueryInput,
  ): Promise<PagOffsetResultDto<ProductResult>>;

  adminFindOneProduct(id: string): Promise<ProductResult>;

  adminUpdateProduct(id: string, dto: UpdateProductInput): Promise<ProductResult>;

  adminRemoveProduct(id: string): Promise<void>;

  findManyProductsByIds(ids: string[]): Promise<ProductResult[]>;

  decrementProductStock(productId: string, quantity: number): Promise<void>;

  incrementProductStock(productId: string, quantity: number): Promise<void>;

  validateAndGetCatalogProducts(ids: string[]): Promise<ProductResult[]>;
}
