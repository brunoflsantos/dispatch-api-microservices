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
import { UserRole } from 'libs/common/enums/user-role.enum';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import {
  AdminCreateProductContractMethod,
  AdminFindAllProductsContractMethod,
  AdminFindOneProductContractMethod,
  AdminRemoveProductContractMethod,
  AdminUpdateProductContractMethod,
  PublicFindAllProductsContractMethod,
  PublicFindOneProductContractMethod,
} from 'libs/contracts/messaging/catalog-contracts';
import { CreateProductDto } from '../dto/catalog/create-product.dto';
import { ProductQueryDto } from '../dto/catalog/product-query.dto';
import { UpdateProductDto } from '../dto/catalog/update-product.dto';
import { ApiCatalogService } from '../services/api-catalog.service';

@Controller('catalog')
@ApiTags('catalog')
@ApiBearerAuth()
export class ApiCatalogController extends BaseController {
  constructor(private readonly apiCatalogService: ApiCatalogService) {
    super(ApiCatalogController.name);
  }

  //#region Products - Public

  @Public()
  @Get('public/products')
  publicFindAllProducts(@Query() query: ProductQueryDto) {
    return this.apiCatalogService.sendMessage(
      new PublicFindAllProductsContractMethod({ query }),
    );
  }

  @Public()
  @Get('public/products/:id')
  publicFindOneProduct(@Param('id') id: string) {
    return this.apiCatalogService.sendMessage(
      new PublicFindOneProductContractMethod({ id }),
    );
  }

  //#endregion

  //#region Products - Admin

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post('admin/products')
  adminCreateProduct(
    @Body() dto: CreateProductDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.apiCatalogService.sendMessage(
      new AdminCreateProductContractMethod({ dto, idempotencyKey }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get('admin/products')
  adminFindAllProducts(@Query() query: ProductQueryDto) {
    return this.apiCatalogService.sendMessage(
      new AdminFindAllProductsContractMethod({ query }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get('admin/products/:id')
  adminFindOneProduct(@Param('id') id: string) {
    return this.apiCatalogService.sendMessage(
      new AdminFindOneProductContractMethod({ id }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Put('admin/products/:id')
  adminUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.apiCatalogService.sendMessage(
      new AdminUpdateProductContractMethod({ id, dto }),
    );
  }

  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Delete('admin/products/:id')
  adminRemoveProduct(@Param('id') id: string) {
    return this.apiCatalogService.sendMessage(
      new AdminRemoveProductContractMethod({ id }),
    );
  }

  //#endregion
}
