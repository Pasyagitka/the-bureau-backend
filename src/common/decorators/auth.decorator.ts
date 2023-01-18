import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ErrorMessageResponseDto } from '../dto/error-message-response.dto';

export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({ status: 401, type: ErrorMessageResponseDto }),
    ApiResponse({ status: 403, type: ErrorMessageResponseDto }),
  );
}
