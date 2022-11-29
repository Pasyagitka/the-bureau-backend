import { Provider } from '@nestjs/common';
import { UpdateUserPolicyProvider } from './update-user-policy.provider';

export const userPolicyProviders: Provider[] = [UpdateUserPolicyProvider];
