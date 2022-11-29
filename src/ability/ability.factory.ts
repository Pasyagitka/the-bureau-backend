import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AppAbility, Action, Subjects } from './types';

@Injectable()
export class AbilityFactory {
  defineAbility(user: any) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    can([Action.Read, Action.Update], User);
    cannot([Action.Create, Action.Delete], User).because('You are not the admin!');
    cannot(Action.Update, User, { id: { $ne: user.userId } }).because('You are not allowed to update others!');
    
    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
