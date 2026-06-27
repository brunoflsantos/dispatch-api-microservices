import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { I18N_COMMON } from 'libs/common/constants/i18n.constant';
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
import { CursorParamsPipe } from 'libs/common/pipes/cursor-params.pipe';
import { template } from 'libs/common/utils/functions.utils';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { CreateProductDto } from '../dto/catalog/create-product.dto';
import { ProductQueryDto } from '../dto/catalog/product-query.dto';
import { ProductResponseDto } from '../dto/catalog/product-response.dto';
import { UpdateProductDto } from '../dto/catalog/update-product.dto';

@Controller('catalog')
@ApiTags('catalog')
@ApiBearerAuth()
export class ApiCatalogController extends BaseController {
  constructor(private readonly catalogRpcClient: CatalogRpcClient) {
    super(ApiCatalogController.name);
  }

  //#region Products - Public

  @Get('public/products')
  @Public()
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a paginated list of all products',
  })
  // @ApiQuery({ type: ProductQueryDto })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: PagCursorResultDto<ProductResponseDto>,
  })
  publicFindAllProducts(
    @Query() query: ProductQueryDto,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.catalogRpcClient.call(
      new PublicFindAllProductsRpcInput({ query: { ...query, cursor } }),
    );
  }

  @Get('public/products/:id')
  @Public()
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Product unique identifier (UUID)' })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  publicFindOneProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new PublicFindOneProductRpcInput({ id }));
  }

  //#endregion

  //#region Products - Admin

  @Post('admin/products')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with the provided details',
  })
  @ApiHeader({
    name: 'x-idempotency-key',
    description: 'Unique key to prevent duplicate product creation',
    required: true,
  })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  adminCreateProduct(
    @Body() dto: CreateProductDto,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException(
        template(I18N_COMMON.ERRORS.IDEMPOTENCY_KEY_REQUIRED),
      );
    }
    return this.catalogRpcClient.call(
      new AdminCreateProductRpcInput({ dto, idempotencyKey }),
    );
  }

  @Get('admin/products')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Get all products (admin)',
    description: 'Retrieve a paginated list of all products for admin users',
  })
  // @ApiQuery({ type: ProductQueryDto })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: PagCursorResultDto<ProductResponseDto>,
  })
  adminFindAllProducts(
    @Query() query: ProductQueryDto,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.catalogRpcClient.call(
      new AdminFindAllProductsRpcInput({ query: { ...query, cursor } }),
    );
  }

  @Get('admin/products/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Get product by ID (admin)',
    description:
      'Retrieve a specific product by its unique identifier for admin users',
  })
  @ApiParam({ name: 'id', description: 'Product unique identifier (UUID)' })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  adminFindOneProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new AdminFindOneProductRpcInput({ id }));
  }

  @Patch('admin/products/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update the details of an existing product',
  })
  @ApiParam({ name: 'id', description: 'Product unique identifier (UUID)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  adminUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalogRpcClient.call(new AdminUpdateProductRpcInput({ id, dto }));
  }

  @Delete('admin/products/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Remove a product',
    description: 'Remove an existing product by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Product unique identifier (UUID)' })
  @ApiNoContentResponse({ description: 'Product successfully deleted' })
  adminRemoveProduct(@Param('id') id: string) {
    return this.catalogRpcClient.call(new AdminRemoveProductRpcInput({ id }));
  }

  //#endregion
}
