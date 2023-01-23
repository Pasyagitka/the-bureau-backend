import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiResponses(statuses: ApiStatuses) {
  const decorators = [];
  Object.keys(statuses).forEach((element) => {
    if (Array.isArray(statuses[element]) && statuses[element]?.every((x) => !isClass(x))) {
      decorators.push(...statuses[element]);
    } else decorators.push(ApiResponse({ status: +element, type: statuses[element] }));
  });
  return applyDecorators(...decorators);
}

interface ApiStatuses {
  [key: number]: unknown;
}

function isClass(v) {
  return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}
