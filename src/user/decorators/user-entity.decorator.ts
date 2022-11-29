import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const UserEntity = createParamDecorator<unknown, ExecutionContext, User>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return request.userr;
  },
);
