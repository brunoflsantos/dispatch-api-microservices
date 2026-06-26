import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { GetUser } from 'libs/common/decorators/get-user.decorator';
import {
  CountUnreadNotificationsRpcInput,
  FindByUserNotificationsRpcInput,
  HasNewNotificationsRpcInput,
  MarkNotificationAsReadRpcInput,
} from 'libs/common/modules/transport/dto/notifications-rpc.input';
import { NotificationsRpcClient } from 'libs/common/modules/transport/providers/notifications-rpc-client';
import { CursorParamsPipe } from 'libs/common/pipes/cursor-params.pipe';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { NotificationResponseDto } from '../dto/notifications/notification-response.dto';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class ApiNotificationsController extends BaseController {
  constructor(private readonly notificationsRpcClient: NotificationsRpcClient) {
    super(ApiNotificationsController.name);
  }

  @Get('public/notifications')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get user notifications',
    description:
      'Retrieve a paginated list of notifications for the authenticated user',
  })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiOkResponse({ type: PagCursorResultDto<NotificationResponseDto> })
  findByUser(
    @GetUser() user: RequestUser,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.notificationsRpcClient.call(
      new FindByUserNotificationsRpcInput({
        query: { userId: user.id, language: user.language, cursor },
      }),
    );
  }

  @Patch('public/notifications/:id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Mark a specific notification as read for the authenticated user',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', type: String })
  @ApiNoContentResponse()
  markAsRead(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.notificationsRpcClient.call(
      new MarkNotificationAsReadRpcInput({ userId: user.id, id }),
    );
  }

  @Get('public/notifications/unread/count')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Count unread notifications',
    description: 'Get the count of unread notifications for the authenticated user',
  })
  @ApiOkResponse({ type: Number })
  countUnread(@GetUser() user: RequestUser) {
    return this.notificationsRpcClient.call(
      new CountUnreadNotificationsRpcInput({ userId: user.id }),
    );
  }

  @Get('public/notifications/has-new')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Check for new notifications',
    description:
      'Check if there are any new notifications for the authenticated user',
  })
  @ApiOkResponse({ type: Boolean })
  hasNewNotifications(@GetUser() user: RequestUser) {
    return this.notificationsRpcClient.call(
      new HasNewNotificationsRpcInput({ userId: user.id }),
    );
  }
}
