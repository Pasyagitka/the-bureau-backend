import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateUserHandler } from 'src/ability/policies/user/update-user-policy.handler';

export const UpdateUserPolicyProvider: Provider = {
  provide: UpdateUserHandler,
  inject: [REQUEST],
  useFactory: (request: Request) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    console.log(request.body);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return new UpdateUserHandler(request.body);
  },
};
