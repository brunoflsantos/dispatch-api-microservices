import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestContext } from 'libs/common/utils/request-context.utils';
import { Observable } from 'rxjs';

@Injectable()
export class RpcCorrelationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToRpc().getData();
    const correlationId = data?.correlationId ?? crypto.randomUUID();

    return new Observable((subscriber) => {
      void RequestContext.run(correlationId, () => {
        next.handle().subscribe(subscriber);
        return Promise.resolve();
      });
    });
  }
}
