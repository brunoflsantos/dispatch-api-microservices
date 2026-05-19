import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { resolveThrottleLimit } from 'libs/common/config/throttle.config';
import { I18N_COMMON } from 'libs/common/constants/i18n.constant';
import { GetUser } from 'libs/common/decorators/get-user.decorator';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { Role } from 'libs/common/enums/role.enum';
import {
  AdminDeliverOrderRpcInput,
  AdminFindAllOrdersRpcInput,
  AdminFindOneOrderRpcInput,
  AdminRefundOrderRpcInput,
  AdminRemoveOrderRpcInput,
  AdminShipOrderRpcInput,
  AdminUpdateOrderRpcInput,
  PublicCancelOrderRpcInput,
  PublicCreateOrderRpcInput,
  PublicFindOneOrderRpcInput,
  PublicFindOrdersByUserRpcInput,
} from 'libs/common/modules/transport/dto/orders-rpc.input';
import { OrdersRpcClient } from 'libs/common/modules/transport/providers/orders-rpc-client';
import { template } from 'libs/common/utils/functions.utils';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { CreateOrderDto } from '../dto/orders/create-order.dto';
import {
  OrderByUserOffsetQueryDto,
  OrderOffsetQueryDto,
} from '../dto/orders/order-offset-query.dto';
import {
  OrderResponseDto,
  PublicOrderResponseDto,
} from '../dto/orders/order-response.dto';
import { ShipOrderDto } from '../dto/orders/ship-order.dto';
import { UpdateOrderDto } from '../dto/orders/update-order.dto';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth()
export class ApiOrdersController extends BaseController {
  constructor(private readonly ordersRpcClient: OrdersRpcClient) {
    super(ApiOrdersController.name);
  }

  //#region Orders - Public

  @Post('public/orders')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: resolveThrottleLimit(10) } })
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates a new order with items and adds it to the processing queue. Requires idempotency-key header to prevent duplicate orders.',
  })
  @ApiHeader({
    name: 'idempotency-key',
    description:
      'Unique key to ensure idempotent requests. Use UUID or any unique string.',
    required: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation data',
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: PublicOrderResponseDto,
  })
  publicCreateOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey: string,
    @GetUser() user: RequestUser,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException(
        template(I18N_COMMON.ERRORS.IDEMPOTENCY_KEY_REQUIRED),
      );
    }
    return this.ordersRpcClient.call(
      new PublicCreateOrderRpcInput({
        dto: createOrderDto,
        reqUser: user,
        idempotencyKey,
      }),
    );
  }

  @Get('public/orders/me')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get orders for the authenticated user',
    description:
      'Retrieve a paginated list of orders belonging to the authenticated user',
  })
  @ApiQuery({ type: OrderByUserOffsetQueryDto })
  @ApiOkResponse({
    description: 'Orders retrieved successfully',
    type: PagOffsetResultDto<PublicOrderResponseDto>,
  })
  publicFindOrdersByUser(
    @Query() queryDto: OrderByUserOffsetQueryDto,
    @GetUser() user: RequestUser,
  ) {
    return this.ordersRpcClient.call(
      new PublicFindOrdersByUserRpcInput({ reqUser: user, query: queryDto }),
    );
  }

  @Get('public/orders/:id')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get order by ID',
    description:
      'Retrieve a specific order by its unique identifier. Only the owner can access their own orders.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier (UUID)',
  })
  @ApiOkResponse({
    description: 'Order retrieved successfully',
    type: PublicOrderResponseDto,
  })
  publicFindOneOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RequestUser,
  ) {
    return this.ordersRpcClient.call(
      new PublicFindOneOrderRpcInput({ id, reqUser: user }),
    );
  }

  @Patch('public/orders/:id/cancel')
  @ApiOperation({
    summary: 'Cancel an order',
    description:
      'Cancels an order and releases reserved inventory. ' +
      'The order must be in PENDING status.',
  })
  @ApiParam({ name: 'id', description: 'Order unique identifier (UUID)' })
  @ApiOkResponse({ description: 'Order cancellation enqueued successfully' })
  publicCancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RequestUser,
  ) {
    return this.ordersRpcClient.call(
      new PublicCancelOrderRpcInput({ id, reqUser: user }),
    );
  }

  //#endregion

  //#region Orders - Admin

  @Get('admin/orders')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL)
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieve a paginated list of orders with optional filtering',
  })
  @ApiQuery({ type: OrderOffsetQueryDto })
  @ApiOkResponse({
    description: 'Orders successfully retrieved',
    type: PagOffsetResultDto<OrderResponseDto>,
  })
  adminFindAllOrders(@Query() queryDto: OrderOffsetQueryDto) {
    return this.ordersRpcClient.call(
      new AdminFindAllOrdersRpcInput({ query: queryDto }),
    );
  }

  @Get('admin/orders/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL)
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve a specific order by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier (UUID)',
  })
  @ApiOkResponse({
    description: 'Order successfully retrieved',
    type: OrderResponseDto,
  })
  adminFindOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersRpcClient.call(new AdminFindOneOrderRpcInput({ id }));
  }

  @Patch('admin/orders/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Update an order',
    description: 'Update order details including status',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier (UUID)',
  })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Order update data',
  })
  @ApiOkResponse({
    description: 'Order successfully updated',
    type: OrderResponseDto,
  })
  adminUpdateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersRpcClient.call(
      new AdminUpdateOrderRpcInput({ id, dto: updateOrderDto }),
    );
  }

  @Delete('admin/orders/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @ApiOperation({
    summary: 'Delete an order',
    description: 'Soft-deletes an order by deactivating it',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier (UUID)',
  })
  @ApiResponse({
    status: 204,
    description: 'Order successfully deleted',
  })
  adminRemoveOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersRpcClient.call(new AdminRemoveOrderRpcInput({ id }));
  }

  @Patch('admin/orders/:id/ship')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.SHIPPER)
  @ApiOperation({
    summary: 'Mark order as shipped',
    description:
      'Marks an order as shipped. The order must be in PROCESSED status. ' +
      'Optionally accepts tracking number and carrier information.',
  })
  @ApiParam({ name: 'id', description: 'Order unique identifier (UUID)' })
  @ApiBody({ type: ShipOrderDto, description: 'Shipping information' })
  @ApiOkResponse({
    description: 'Order successfully marked as shipped',
    type: OrderResponseDto,
  })
  adminShipOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() shipOrderDto: ShipOrderDto,
  ) {
    return this.ordersRpcClient.call(
      new AdminShipOrderRpcInput({ id, dto: shipOrderDto }),
    );
  }

  @Patch(':id/deliver')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.DELIVERY)
  @ApiOperation({
    summary: 'Mark order as delivered',
    description: 'Marks an order as delivered. The order must be in SHIPPED status.',
  })
  @ApiParam({ name: 'id', description: 'Order unique identifier (UUID)' })
  @ApiOkResponse({
    description: 'Order successfully marked as delivered',
    type: OrderResponseDto,
  })
  adminDeliverOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersRpcClient.call(new AdminDeliverOrderRpcInput({ id }));
  }

  @Patch(':id/refund')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL)
  @ApiOperation({
    summary: 'Refund an order',
    description:
      'Initiates a refund for an order. ' +
      'The order must be in PAID, PROCESSED, SHIPPED, or DELIVERED status.',
  })
  @ApiParam({ name: 'id', description: 'Order unique identifier (UUID)' })
  @ApiOkResponse({ description: 'Order refund enqueued successfully' })
  adminRefundOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersRpcClient.call(new AdminRefundOrderRpcInput({ id }));
  }

  //#endregion
}
