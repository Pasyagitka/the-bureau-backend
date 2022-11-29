import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { AppAbility, Action, Subjects } from './types';

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    console.log('AbilityFactory', user);

    switch (user.role) {
      case Role.Admin: {
        can(Action.Manage, 'all');
        break;
      }
      case Role.Brigadier: {
        break;
      }
      default: {
        can([Action.Read, Action.Update], User);
        cannot([Action.Create, Action.Delete], User).because(
          'You are not the admin!',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'You are not allowed to update other users.',
        );
        break;
      }
    }

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
