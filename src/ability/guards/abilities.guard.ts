import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/auth.decorator';
import { AbilityFactory } from '../ability.factory';
import { CHECK_ABILITY } from '../decorators/abilities.decorator';
import { RequiredRule } from '../types';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    console.log('AbilitiesGuard', user);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const ability = this.abilityFactory.defineAbility(user);
    rules.forEach(({ action, subject }) => ForbiddenError.from(ability).throwUnlessCan(action, subject));

    return true;
  }
}
