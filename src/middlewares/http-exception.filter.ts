import {
  ArgumentsHost, BadRequestException, Catch, ExceptionFilter,
  HttpException, HttpStatus, Logger, NotFoundException,
  NotImplementedException, UnauthorizedException, UnprocessableEntityException,
} from '@nestjs/common';

import { Environments, stage } from '../configs';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Logger.error(exception as Error);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status: number;
    let stack: string;
    let code: string;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = (exception.getResponse() as any)?.error || exception.getStatus();
      message = (exception.getResponse() as any)?.message || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_ERROR';
      message = (exception as Error).message;
    }

    if (stage != Environments.prd) {
      stack = (exception as Error).stack;
    }

    response.status(status).json({
      code, message, stack,
      path: request.url,
    });
  }
}

export const customException = (errDesc: string, status: number) => new HttpException(errDesc, status);
export const unauthorized = (errDesc: string) => new UnauthorizedException(errDesc);
export const notFound = (errDesc: string) => new NotFoundException(errDesc);
export const badRequest = (errDesc: string) => new BadRequestException(errDesc);
export const badData = (errDesc: string) => new UnprocessableEntityException(errDesc);
export const notImplemented = (errDesc: string) => new NotImplementedException(errDesc);
