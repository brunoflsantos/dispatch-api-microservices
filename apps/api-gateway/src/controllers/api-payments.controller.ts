import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { GetUser } from 'libs/common/decorators/get-user.decorator';
import { Public } from 'libs/common/decorators/public.decorator';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { Role } from 'libs/common/enums/role.enum';
import {
  FindAllPaymentsRpcInput,
  FindOnePaymentRpcInput,
  FindPaymentByOrderIdRpcInput,
  ProcessStripeWebhookRpcInput,
} from 'libs/common/modules/transport/dto/payments-rpc.input';
import { PaymentsRpcClient } from 'libs/common/modules/transport/providers/payments-rpc-client';
import { CursorParamsPipe } from 'libs/common/pipes/cursor-params.pipe';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import type { CursorQueryInput } from 'libs/contracts/interfaces/cursor-query-input.interface';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth()
export class ApiPaymentsController extends BaseController {
  constructor(private readonly paymentsRpcClient: PaymentsRpcClient) {
    super(ApiPaymentsController.name);
  }

  @Get('admin/payments')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL)
  @SkipThrottle()
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({ type: FindAllPaymentsRpcInput['response'] })
  findAllPayments(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('cursor', CursorParamsPipe) cursor: CursorQueryInput,
  ) {
    return this.paymentsRpcClient.call(
      new FindAllPaymentsRpcInput({ query: { userId, cursor } }),
    );
  }

  @Get('admin/payments/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.FINANCIAL)
  @SkipThrottle()
  @ApiOkResponse({ type: FindOnePaymentRpcInput['response'] })
  findOnePayment(@GetUser() user: RequestUser, @Param('id') paymentId: string) {
    return this.paymentsRpcClient.call(new FindOnePaymentRpcInput({ paymentId }));
  }

  @Get('public/payments/order/:orderId')
  @SkipThrottle()
  @ApiOkResponse({ type: FindPaymentByOrderIdRpcInput['response'] })
  findPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsRpcClient.call(
      new FindPaymentByOrderIdRpcInput({ orderId }),
    );
  }

  //#region Stripe Area

  @Post('webhook/stripe')
  @Public()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe webhook endpoint',
    description:
      'Receives payment gateway events and updates the corresponding order.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature header',
    required: true,
  })
  @ApiOkResponse({
    description: 'Webhook processed successfully',
  })
  async processStripeWebhook(
    @Req() request: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') webhookSignature: string,
  ) {
    if (!webhookSignature) {
      throw new BadRequestException("The 'stripe-signature' header is required.");
    }
    await this.paymentsRpcClient.call(
      new ProcessStripeWebhookRpcInput({
        request,
        signature: webhookSignature,
      }),
    );
    return { success: true };
  }

  //#endregion
}
