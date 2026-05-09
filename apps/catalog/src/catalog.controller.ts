import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import {
  AdminCreateProductContractMethod,
  AdminFindAllProductsContractMethod,
  AdminFindOneProductContractMethod,
  AdminRemoveProductContractMethod,
  AdminUpdateProductContractMethod,
  DecrementProductsStockContractMethod,
  FindManyProductsByIdsContractMethod,
  IncrementProductsStockContractMethod,
  PublicFindAllProductsContractMethod,
  PublicFindOneProductContractMethod,
  ValidateAndGetProductsContractMethod,
} from 'libs/contracts/messaging/catalog-contracts';
import { CATALOG_SERVICE } from './constants/catalog.token';
import type { ICatalogService } from './interfaces/catalog-service.interface';

@Controller()
export class CatalogController extends BaseController {
  constructor(@Inject(CATALOG_SERVICE) private readonly service: ICatalogService) {
    super(CatalogController.name);
  }

  //#region Products - Public

  @MessagePattern(PublicFindAllProductsContractMethod.message)
  publicFindAllProducts(
    @Payload() data: typeof PublicFindAllProductsContractMethod.prototype.payload,
  ): Promise<typeof PublicFindAllProductsContractMethod.prototype.response> {
    return this.service.publicFindAllProducts(data.query);
  }

  @MessagePattern(PublicFindOneProductContractMethod.message)
  publicFindOneProduct(
    @Payload() data: typeof PublicFindOneProductContractMethod.prototype.payload,
  ): Promise<typeof PublicFindOneProductContractMethod.prototype.response> {
    return this.service.publicFindOneProduct(data.id);
  }

  //#endregion

  //#region Products - Admin

  @MessagePattern(AdminCreateProductContractMethod.message)
  adminCreateProduct(
    @Payload() data: typeof AdminCreateProductContractMethod.prototype.payload,
  ): Promise<typeof AdminCreateProductContractMethod.prototype.response> {
    return this.service.adminCreateProduct(data.dto, data.idempotencyKey);
  }

  @MessagePattern(AdminFindAllProductsContractMethod.message)
  adminFindAllProducts(
    @Payload() data: typeof AdminFindAllProductsContractMethod.prototype.payload,
  ): Promise<typeof AdminFindAllProductsContractMethod.prototype.response> {
    return this.service.adminFindAllProducts(data.query);
  }

  @MessagePattern(AdminFindOneProductContractMethod.message)
  adminFindOneProduct(
    @Payload() data: typeof AdminFindOneProductContractMethod.prototype.payload,
  ): Promise<typeof AdminFindOneProductContractMethod.prototype.response> {
    return this.service.adminFindOneProduct(data.id);
  }

  @MessagePattern(AdminUpdateProductContractMethod.message)
  adminUpdateProduct(
    @Payload() data: typeof AdminUpdateProductContractMethod.prototype.payload,
  ): Promise<typeof AdminUpdateProductContractMethod.prototype.response> {
    return this.service.adminUpdateProduct(data.id, data.dto);
  }

  @MessagePattern(AdminRemoveProductContractMethod.message)
  async adminRemoveProduct(
    @Payload() data: typeof AdminRemoveProductContractMethod.prototype.payload,
  ): Promise<typeof AdminRemoveProductContractMethod.prototype.response> {
    await this.service.adminRemoveProduct(data.id);
  }

  //#endregion

  //#region Products - Internals

  @MessagePattern(FindManyProductsByIdsContractMethod.message)
  findManyProductsByIds(
    @Payload() data: typeof FindManyProductsByIdsContractMethod.prototype.payload,
  ): Promise<typeof FindManyProductsByIdsContractMethod.prototype.response> {
    return this.service.findManyProductsByIds(data.ids);
  }

  @MessagePattern(DecrementProductsStockContractMethod.message)
  decrementProductStock(
    @Payload() data: typeof DecrementProductsStockContractMethod.prototype.payload,
  ): Promise<typeof DecrementProductsStockContractMethod.prototype.response> {
    return this.service.decrementProductStock(data.id, data.quantity);
  }

  @MessagePattern(IncrementProductsStockContractMethod.message)
  incrementProductStock(
    @Payload() data: typeof IncrementProductsStockContractMethod.prototype.payload,
  ): Promise<typeof IncrementProductsStockContractMethod.prototype.response> {
    return this.service.incrementProductStock(data.id, data.quantity);
  }

  @MessagePattern(ValidateAndGetProductsContractMethod.message)
  validateAndGetCatalogProducts(
    @Payload() data: typeof ValidateAndGetProductsContractMethod.prototype.payload,
  ): Promise<typeof ValidateAndGetProductsContractMethod.prototype.response> {
    return this.service.validateAndGetCatalogProducts(data.ids);
  }

  //#endregion
}
