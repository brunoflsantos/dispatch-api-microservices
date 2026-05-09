import { Request } from 'express';
import { RequestUser } from './request-user.interface';

export interface RequestWithUser extends Request {
  user: RequestUser;
}
