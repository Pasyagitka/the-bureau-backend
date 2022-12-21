import { ForbiddenError } from '@casl/ability';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppAbility } from '../types';

@Catch(ForbiddenError)
export class ForbiddenAbilityFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { message, name: error } = exception;
    const statusCode = HttpStatus.FORBIDDEN;

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
