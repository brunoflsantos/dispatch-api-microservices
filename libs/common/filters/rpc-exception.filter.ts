import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class RpcExceptionConverterFilter implements ExceptionFilter {
  catch(exception: unknown, _host: ArgumentsHost) {
    void _host;

    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    return throwError(() => new RpcException(this.toPayload(exception)));
  }

  private toPayload(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      return {
        statusCode: exception.getStatus(),
        message:
          typeof response === 'string'
            ? response
            : ((response as { message?: string | string[] }).message ??
              exception.message),
        error:
          typeof response === 'string'
            ? exception.name
            : ((response as { error?: string }).error ?? exception.name),
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Error',
    };
  }
}
