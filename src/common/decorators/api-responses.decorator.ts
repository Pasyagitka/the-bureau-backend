import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiResponses(statuses: ApiStatuses) {
  return applyDecorators(
    ...(Object.keys(statuses).map(status => ApiResponse({status: +status, type: statuses[status]})))
  );
}

interface ApiStatuses {
  [key: number]: unknown,
}
