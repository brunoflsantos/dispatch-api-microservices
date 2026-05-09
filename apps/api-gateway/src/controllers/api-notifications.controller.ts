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
import { CursorParamsPipe } from 'libs/common/pipes/cursor-params.pipe';
import { BaseController } from 'libs/contracts/controllers/base.controller';
import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import type { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import {
  CountUnreadNotificationsContractMethod,
  FindByUserNotificationsContractMethod,
  HasNewNotificationsContractMethod,
  MarkNotificationAsReadContractMethod,
} from 'libs/contracts/messaging/notifications-contracts';
import type { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { NotificationResponseDto } from '../dto/notifications/notification-response.dto';
import { ApiNotificationsService } from '../services/api-notifications.service';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class ApiNotificationsController extends BaseController {
  constructor(private readonly apiNotificationsService: ApiNotificationsService) {
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
    return this.apiNotificationsService.sendMessage(
      new FindByUserNotificationsContractMethod({ user, cursor }),
    );
  }

  @Patch('public/notifications/:id/read')
  @ApiParam({ name: 'id', description: 'Notification ID', type: String })
  async markAsRead(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.apiNotificationsService.sendMessage(
      new MarkNotificationAsReadContractMethod({ userId: user.id, id }),
    );
  }

  @Get('public/notifications/unread/count')
  @SkipThrottle()
  @ApiOkResponse({ type: Number })
  async countUnread(@GetUser() user: RequestUser) {
    return this.apiNotificationsService.sendMessage(
      new CountUnreadNotificationsContractMethod({ userId: user.id }),
    );
  }

  @Get('public/notifications/has-new')
  @SkipThrottle()
  @ApiOkResponse({ type: Boolean })
  async hasNewNotifications(@GetUser() user: RequestUser) {
    return this.apiNotificationsService.sendMessage(
      new HasNewNotificationsContractMethod({ userId: user.id }),
    );
  }
}
