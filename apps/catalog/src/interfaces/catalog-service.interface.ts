import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { IBaseService } from 'libs/contracts/interfaces/base-service.interface';
import { CreateProductRequestContract } from 'libs/contracts/interfaces/products/create-product-request.interface';
import { ProductQueryRequestContract } from 'libs/contracts/interfaces/products/product-query-request.interface';
import {
  ProductResponseContract,
  PublicProductResponseContract,
} from 'libs/contracts/interfaces/products/product-response.interface';
import { UpdateProductRequestContract } from 'libs/contracts/interfaces/products/update-product-request.interface';

export interface ICatalogService extends IBaseService {
  publicFindAllProducts(
    query: ProductQueryRequestContract,
  ): Promise<PagOffsetResultDto<PublicProductResponseContract>>;

  publicFindOneProduct(id: string): Promise<PublicProductResponseContract>;

  adminCreateProduct(
    dto: CreateProductRequestContract,
    idempotencyKey: string,
  ): Promise<ProductResponseContract>;

  adminFindAllProducts(
    query: ProductQueryRequestContract,
  ): Promise<PagOffsetResultDto<ProductResponseContract>>;

  adminFindOneProduct(id: string): Promise<ProductResponseContract>;

  adminUpdateProduct(
    id: string,
    dto: UpdateProductRequestContract,
  ): Promise<ProductResponseContract>;

  adminRemoveProduct(id: string): Promise<void>;

  findManyProductsByIds(ids: string[]): Promise<ProductResponseContract[]>;

  decrementProductStock(productId: string, quantity: number): Promise<void>;

  incrementProductStock(productId: string, quantity: number): Promise<void>;

  validateAndGetCatalogProducts(ids: string[]): Promise<ProductResponseContract[]>;
}
