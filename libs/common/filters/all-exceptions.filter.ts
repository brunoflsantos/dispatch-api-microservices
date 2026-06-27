/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { ErrorResponseDto } from 'libs/contracts/dto/error-response.dto';
import { I18nContext } from 'nestjs-i18n';
import os from 'os';
import { I18N_COMMON } from '../constants/i18n.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, errorName } = this.extractErrorInfo(exception);
    const i18n = I18nContext.current();
    const resolvedMessage = this.resolveI18nMessage(
      exception,
      message,
      status,
      i18n,
    );

    const newline = os.EOL || '\n';
    this.logger.error(
      `HTTP Status: ${status}${newline}` +
        `Error: ${JSON.stringify(resolvedMessage)}${newline}` +
        `Path: ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorResponse: ErrorResponseDto = {
      message: Array.isArray(resolvedMessage)
        ? resolvedMessage.join(', ')
        : resolvedMessage,
      error: errorName,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private extractErrorInfo(exception: unknown): {
    status: number;
    message: string | string[];
    errorName: string;
  } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      return {
        status: exception.getStatus(),
        message:
          typeof res === 'string'
            ? res
            : ((res as any).message ?? exception.message),
        errorName: exception.name,
      };
    }

    if (exception instanceof RpcException) {
      const err = exception.getError();
      if (typeof err === 'object' && err !== null) {
        const e = err as Record<string, any>;
        return {
          status: e.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
          message: e.message ?? 'Internal server error',
          errorName: e.error ?? exception.name,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: String(err),
        errorName: exception.name,
      };
    }

    // Plain RPC error payload { statusCode, message, error } deserialized from transport
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      typeof (exception as any).statusCode === 'number'
    ) {
      const e = exception as Record<string, any>;
      return {
        status: e.statusCode,
        message: e.message ?? 'Internal server error',
        errorName: e.error ?? 'Error',
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        errorName: exception.name,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errorName: 'Error',
    };
  }

  private resolveI18nMessage(
    exception: unknown,
    fallback: string | string[],
    status: number,
    i18n: I18nContext | undefined | null,
  ): string | string[] {
    if (exception instanceof HttpException && i18n) {
      const res = exception.getResponse() as any;
      if (res?.key) {
        return i18n.translate(res.key, { args: res.args });
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR && i18n) {
      return i18n.translate(I18N_COMMON.ERRORS.INTERNAL_SERVER_ERROR);
    }

    return fallback;
  }
}
