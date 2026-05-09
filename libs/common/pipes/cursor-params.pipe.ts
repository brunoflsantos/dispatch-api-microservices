import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { template } from '@/shared/utils/functions.utils';
import { CursorParams } from 'libs/contracts/types/cursor-params.type';
import { I18N_COMMON } from '../constants/i18n.constant';

@Injectable()
export class CursorParamsPipe implements PipeTransform<
  string | undefined,
  CursorParams | undefined
> {
  transform(value: string | undefined): CursorParams | undefined {
    if (!value) {
      return undefined;
    }

    const decoded = Buffer.from(value, 'base64').toString('utf8');
    const parsedCursor = JSON.parse(decoded) as Partial<CursorParams>;

    if (!parsedCursor.createdAt || !parsedCursor.id) {
      throw new BadRequestException(template(I18N_COMMON.ERRORS.INVALID_CURSOR));
    }

    return {
      createdAt: parsedCursor.createdAt,
      id: parsedCursor.id,
    };
  }
}
