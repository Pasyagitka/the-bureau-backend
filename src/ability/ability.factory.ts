import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Request } from 'src/request/entities/request.entity';
import { User } from 'src/user/entities/user.entity';
import { AppAbility, Action, Subjects } from './types';

type BrigadierUser = Brigadier & {
  'user.id': Brigadier['user']['id'];
};

type RequestBrigadier = Request & {
  'brigadier.user.id': Request['brigadier']['user']['id'];
};

type ClientUser = Client & {
  'user.id': Client['user']['id'];
};

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

    console.log('AbilityFactory', user);

    switch (user.role) {
      case Role.Admin: {
        can(Action.Manage, 'all');
        break;
      }
      case Role.Brigadier: {
        can([Action.Read, Action.Update], Brigadier);
        can([Action.Read, Action.Update], Request);
        can([Action.Read, Action.Update], User);
        cannot<RequestBrigadier>(Action.Update, Request, {
          'brigadier.user.id': { $ne: user.id },
        }).because('You are not allowed to update this request.');
        cannot<BrigadierUser>(Action.Update, Brigadier, { 'user.id': { $ne: user.id } }).because(
          'You are not allowed to update other brigadiers.',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'You are not allowed to update other users.',
        );
        break;
      }
      default: {
        can(Action.Read, Brigadier);
        can([Action.Read, Action.Update], Client);
        can([Action.Update], User);
        // cannot([Action.Create, Action.Delete], User).because('You are not the admin!');
        cannot<ClientUser>([Action.Update], Client, {
          'user.id': { $ne: user.id },
        }).because('You are not allowed to manage other clients.');
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'You are not allowed to update other users.',
        );
        break;
      }
    }

    return build({
      detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}