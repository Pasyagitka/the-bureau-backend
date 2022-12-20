import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Request } from 'src/request/entities/request.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import { AppAbility, Action, Subjects } from './types';

type BrigadierUser = Brigadier & {
  'user.id': Brigadier['user']['id'];
};

type RequestBrigadier = Request & {
  'brigadier.user.id': Request['brigadier']['user']['id'];
};

type RequestClient = Request & {
  'client.user.id': Request['client']['user']['id'];
};

type ClientUser = Client & {
  'user.id': Client['user']['id'];
};

type ScheduleBrigadier = Schedule & {
  'brigadier.user.id': Schedule['brigadier']['user']['id'];
};

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

    console.log('AbilityFactory', user);

    switch (user.role) {
      case Role.Admin: {
        can(Action.Manage, 'all');
        cannot(Action.Create, Request).because('Only clients can create requests. You are admin.');
        break;
      }
      case Role.Brigadier: {
        can([Action.Read, Action.Update], Brigadier);
        can([Action.Read, Action.Update], Request);
        can([Action.Read, Action.Update], User);
        can(Action.Read, Schedule);
        cannot<ScheduleBrigadier>(Action.Read, Schedule, {
          'brigadier.user.id': { $ne: user.id },
        }).because('You are not allowed to view this schedule.');
        cannot<RequestBrigadier>(Action.Read, Request, {
          'brigadier.user.id': { $ne: user.id },
        }).because('You are not allowed to view this request.');
        cannot<RequestBrigadier>(Action.Update, Request, {
          'brigadier.user.id': { $ne: user.id },
        }).because('You are not allowed to update this request.');
        cannot<BrigadierUser>(Action.Update, Brigadier, { 'user.id': { $ne: user.id } }).because(
          'You are not allowed to update other brigadiers.',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'You are not allowed to update other users.',
        );
        cannot(Action.ManageAccess, User).because('You are not admin');

        break;
      }
      default: {
        can([Action.Create, Action.Read], Request);
        can(Action.Read, Brigadier);
        can(Action.Read, Equipment);
        can([Action.Read, Action.Update], Client);
        can([Action.Update], User);
        cannot<RequestClient>(Action.Read, Request, {
          'client.user.id': { $ne: user.id },
        }).because('You are not allowed to view this request.');
        // cannot([Action.Create, Action.Delete], User).because('You are not the admin!');
        cannot<ClientUser>([Action.Update], Client, {
          'user.id': { $ne: user.id },
        }).because('You are not allowed to manage other clients.');
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'You are not allowed to update other users.',
        );
        cannot(Action.ManageAccess, User).because('You are not admin');
        break;
      }
    }

    return build({
      detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
