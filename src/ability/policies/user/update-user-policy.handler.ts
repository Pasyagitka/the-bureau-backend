import { Action, AppAbility } from 'src/ability/types';
import { User } from 'src/user/entities/user.entity';
import { PolicyHandler } from '../policy-handler.interface';

export class UpdateUserHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability: AppAbility): boolean {
    console.log('UpdateUserHandler', ability, this.user);
    if (!this.user) return false;
    return ability.can(Action.Update, this.user);
  }
}
