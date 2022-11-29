import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  Type,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability.factory';

import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { PolicyHandler } from '../policies/policy-handler.interface';
import { Request } from 'express';
import { RequiredRule } from '../types';
import { CHECK_ABILITY } from '../decorators/abilities.decorator';

// declare module 'express' {
//   export interface Request {
//     user: any;
//   }
// }

@Injectable()
export class AbilitiesGuard implements CanActivate {
  // constructor(
  //   private reflector: Reflector,
  //   private caslAbilityFactory: AbilityFactory,
  //   // private moduleRef: ModuleRef,
  // ) {}

  // async canActivate(ctx: ExecutionContext) {
  //   const policiesHandlersRef =
  //     this.reflector.get<Type<PolicyHandler>[]>(
  //       CHECK_POLICIES_KEY,
  //       ctx.getHandler(),
  //     ) || [];

  //   console.log('AbilitiesGuard1', policiesHandlersRef);

  //   if (policiesHandlersRef.length === 0) return true;

  //   const contextId = ContextIdFactory.create();
  //   this.moduleRef.registerRequestByContextId(
  //     ctx.switchToHttp().getRequest(),
  //     contextId,
  //   );

  //   const policyHandlers: PolicyHandler[] = [];
  //   for (let i = 0; i < policiesHandlersRef.length; i++) {
  //     const policyHandlerRef = policiesHandlersRef[i];
  //     const policyScope = this.moduleRef.introspect(policyHandlerRef).scope;
  //     let policyHandler: PolicyHandler;
  //     if (policyScope === Scope.DEFAULT) {
  //       policyHandler = this.moduleRef.get(policyHandlerRef, { strict: false });
  //     } else {
  //       policyHandler = await this.moduleRef.resolve(
  //         policyHandlerRef,
  //         contextId,
  //         { strict: false },
  //       );
  //     }
  //     policyHandlers.push(policyHandler);
  //   }

  //   const { user } = ctx.switchToHttp().getRequest();
  //   console.log('AbilitiesGuard user', user);

  //   if (!user) return false;

  //   console.log('AbilitiesGuard3', policyHandlers);

  //   const ability = this.caslAbilityFactory.defineAbility(user);
  //   return policyHandlers.every((handler) => handler.handle(ability));
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    //const user: any = { id: 1, isAdmin: false, role: 'Client' }; // mock user

    const ability = this.abilityFactory.defineAbility(user);

    console.log('Guard', user, ability);
    rules.forEach(({ action, subject }) =>
      ForbiddenError.from(ability).throwUnlessCan(action, subject),
    );

    return true;
  }
}
