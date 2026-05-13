import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'libs/common/decorators/public.decorator';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { Role } from 'libs/common/enums/role.enum';
import {
  AdminCreateProductRpcInput,
  AdminFindAllProductsRpcInput,
  AdminFindOneProductRpcInput,
  AdminRemoveProductRpcInput,
  AdminUpdateProductRpcInput,
  PublicFindAllProductsRpcInput,
  PublicFindOneProductRpcInput,
} from 'libs/common/modules/transport/dto/catalog-rpc.input';
import { CatalogRpcClient } from 'libs/common/modules/transport/providers/catalog-rpc-client';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { CreateProductDto } from '../dto/catalog/create-product.dto';
import { ProductQueryDto } from '../dto/catalog/product-query.dto';
import { UpdateProductDto } from '../dto/catalog/update-product.dto';

@Controller('catalog')
@ApiTags('catalog')
@ApiBearerAuth()
export class ApiCatalogController extends BaseController {
  constructor(private readonly catalogRpcClient: CatalogRpcClient) {
    super(ApiCatalogController.name);
  }

  //#region Products - Public

  @Public()
  @Get('public/products')
  publicFindAllProducts(@Query() query: ProductQueryDto) {
    return this.catalogRpcClient.call(new PublicFindAllProductsRpcInput({ query }));
  }

  @Public()
  @Get('public/products/:id')
  publicFindOneProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new PublicFindOneProductRpcInput({ id }));
  }

  //#endregion

  //#region Products - Admin

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post('admin/products')
  adminCreateProduct(
    @Body() dto: CreateProductDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.catalogRpcClient.call(
      new AdminCreateProductRpcInput({ dto, idempotencyKey }),
    );
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('admin/products')
  adminFindAllProducts(@Query() query: ProductQueryDto) {
    return this.catalogRpcClient.call(new AdminFindAllProductsRpcInput({ query }));
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('admin/products/:id')
  adminFindOneProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new AdminFindOneProductRpcInput({ id }));
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Put('admin/products/:id')
  adminUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalogRpcClient.call(new AdminUpdateProductRpcInput({ id, dto }));
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete('admin/products/:id')
  adminRemoveProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new AdminRemoveProductRpcInput({ id }));
  }

  //#endregion
}
