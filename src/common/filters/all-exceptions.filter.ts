import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, Inject, Logger } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    this.logger.error(`Error: ${message}`);

    if (exception instanceof TypeORMError) {
      response.status(status).json({ message: 'Произошла ошибка. Попробуйте позже...' });
    } else
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
