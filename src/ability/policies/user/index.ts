import { Type } from '@nestjs/common';

import { PolicyHandler } from '../policy-handler.interface';
import { UpdateUserHandler } from './update-user-policy.handler';

export const userPolicies: Type<PolicyHandler>[] = [UpdateUserHandler];
