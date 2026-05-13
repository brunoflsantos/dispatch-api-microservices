import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
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
import type { CursorParams } from 'libs/contracts/dto/cursor-query.dto';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
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
  @ApiOkResponse({ type: PagCursorResultDto<NotificationResponseDto> })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  async findByUser(
    @GetUser() user: RequestUser,
    @Query('cursor', CursorParamsPipe) cursor: CursorParams,
  ) {
    return this.notificationsRpcClient.call(
      new FindByUserNotificationsRpcInput({ user, cursor }),
    );
  }

  @Patch('public/notifications/:id/read')
  @ApiParam({ name: 'id', description: 'Notification ID', type: String })
  async markAsRead(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.notificationsRpcClient.call(
      new MarkNotificationAsReadRpcInput({ userId: user.id, id }),
    );
  }

  @Get('public/notifications/unread/count')
  @SkipThrottle()
  @ApiOkResponse({ type: Number })
  async countUnread(@GetUser() user: RequestUser) {
    return this.notificationsRpcClient.call(
      new CountUnreadNotificationsRpcInput({ userId: user.id }),
    );
  }

  @Get('public/notifications/has-new')
  @SkipThrottle()
  @ApiOkResponse({ type: Boolean })
  async hasNewNotifications(@GetUser() user: RequestUser) {
    return this.notificationsRpcClient.call(
      new HasNewNotificationsRpcInput({ userId: user.id }),
    );
  }
}
