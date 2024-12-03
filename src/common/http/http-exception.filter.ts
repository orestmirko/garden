import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CannotCreateEntityIdMapError } from 'typeorm';

import { GlobalResponseError } from '#common/utils';
import { AppConfigService } from '#config/app/configuration.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly appConfigService: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).message;
    let code = 'HttpException';

    Logger.error(
      this.prepareLogString(message, (exception as any).stack),
      `${request.method} ${request.url}`,
    );

    let status;
    if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
      message = (exception.getResponse() as any).message;
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as CannotCreateEntityIdMapError).message;
      code = (exception as any).code;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json(GlobalResponseError(status, message, code, request));
  }

  private prepareLogString(message: string, stackString: string): string {
    const stack = stackString.replace(/ {2}/g, '').split(/\n|\r\n|\r/);
    const string = JSON.stringify({ message, stack }, null, 2);

    return this.appConfigService.environment === 'LOCAL'
      ? string
      : string.replace(/\n|\r\n/g, '\r');
  }
}
