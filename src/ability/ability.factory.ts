import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/enum/role.enum';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Client } from '../client/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { Request } from '../request/entities/request.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { User } from '../user/entities/user.entity';
import { Action, AppAbility, Subjects } from './types';
import { Accessory } from '../accessory/entities/accessory.entity';
import { RequestReport } from '../request-report/entities/request-report.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Stage } from 'src/stage/entities/stage.entity';

type RequestBrigadier = Request & {
  'brigadier.userId': Request['brigadier']['userId'];
};

type RequestClient = Request & {
  'client.userId': Request['client']['userId'];
};

type ScheduleBrigadier = Schedule & {
  'brigadier.userId': Schedule['brigadier']['userId'];
};

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

    //console.log('AbilityFactory', user);

    switch (user.role) {
      case Role.Admin: {
        can(Action.Manage, 'all');
        cannot(Action.Create, Request).because('Only clients can create requests. You are admin.');
        break;
      }
      case Role.Brigadier: {
        can([Action.Read], Accessory); //TODO
        can([Action.Read], Stage);
        can([Action.Read, Action.Update], Brigadier);
        can([Action.Create, Action.Read], Invoice);
        can([Action.Read, Action.Update], Request);
        can([Action.Read, Action.Update], RequestReport);
        can([Action.Read, Action.Update], User);
        can(Action.Read, Schedule);
        cannot<ScheduleBrigadier>(Action.Read, Schedule, { 'brigadier.userId': { $ne: user.id } }).because(
          'You are not allowed to view this schedule.',
        );
        cannot<RequestBrigadier>(Action.Read, Request, { 'brigadier.userId': { $ne: user.id } }).because(
          'You are not allowed to view this request.',
        );
        cannot<RequestBrigadier>(Action.Update, Request, { 'brigadier.userId': { $ne: user.id } }).because(
          'You are not allowed to update this request.',
        );
        cannot(Action.Update, Brigadier, { id: { $ne: user.brigadier?.id } }).because(
          'You are not allowed to update other brigadiers.',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because('You are not allowed to update other users.');
        cannot(Action.ManageAccess, User).because('You are not admin');

        break;
      }
      default: {
        can([Action.Create, Action.Read], Request);
        can([Action.Read], Stage);
        can(Action.Read, Brigadier);
        can(Action.Read, Equipment);
        can([Action.Read, Action.Update], Client);
        can([Action.Update], User);
        cannot<RequestClient>(Action.Read, Request, {
          'client.userId': { $ne: user.id },
        }).because('You are not allowed to view this request.');
        // cannot([Action.Create, Action.Delete], User).because('You are not the admin!');
        cannot([Action.Update], Client, { id: { $ne: user.client?.id } }).because(
          'You are not allowed to manage other clients.',
        );
        cannot([Action.Read], Client, { id: { $ne: user.client?.id } }).because(
          'You are not allowed to view other clients.',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because('You are not allowed to update other users.');
        cannot(Action.ManageAccess, User).because('You are not admin');
        break;
      }
    }

    return build({
      detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
