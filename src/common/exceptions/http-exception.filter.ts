import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { errorMessage } from '../constants/error-message';

interface IHttpException {
  message: string | string[];
  code?: string;
}

export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Exception ที่โยนจาก HttpException ทั่วไป
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const { message, code } = exception.getResponse() as IHttpException;

      return response.status(status).json({
        code: code || status?.toString(),
        message: typeof message === 'string' ? message : message?.[0],
      });
    }

    this.logger.error('Unhandled exception', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR] || 'Internal Server Error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}