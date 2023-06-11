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
import { Stage } from '../stage/entities/stage.entity';

type RequestBrigadier = Request & {
  'brigadier.userId': Request['brigadier']['userId'];
};

type RequestClient = Request & {
  'client.userId': Request['client']['userId'];
};

type ScheduleBrigadier = Schedule & {
  'brigadier.userId': Schedule['brigadier']['userId'];
};

type InvoiceCustomer = Invoice & {
  'customer.userId': Invoice['customer']['userId'];
};

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

    switch (user.role) {
      case Role.Admin: {
        can(Action.Manage, 'all');
        cannot(Action.Create, Request).because('Только клиент может создавать заявки.');
        break;
      }
      case Role.Brigadier: {
        can([Action.Read], Accessory);
        can([Action.Read], Stage);
        can([Action.Read, Action.Update], Brigadier);
        can([Action.Create, Action.Update, Action.Delete, Action.Read], Invoice);
        can([Action.Read, Action.Update], Request);
        can([Action.Read, Action.Update], RequestReport);
        can([Action.Read, Action.Update], User);
        can(Action.Read, Schedule);
        can([Action.Read, Action.Update, Action.Delete], Invoice);
        cannot<ScheduleBrigadier>(Action.Read, Schedule, { 'brigadier.userId': { $ne: user.id } }).because(
          'У вас нет прав на просмотр этой истории работы.',
        );
        cannot<RequestBrigadier>(Action.Read, Request, { 'brigadier.userId': { $ne: user.id } }).because(
          'У вас нет прав на просмотр этой заявки.',
        );
        cannot<RequestBrigadier>(Action.Update, Request, { 'brigadier.userId': { $ne: user.id } }).because(
          'У вас нет прав на обновление этой заявки.',
        );
        cannot(Action.Update, Brigadier, { id: { $ne: user.brigadier?.id } }).because(
          'У вас нет прав на просмотр данных об этом бригадире.',
        );
        cannot<InvoiceCustomer>([Action.Read, Action.Update, Action.Delete], Invoice, {
          'customer.userId': { $ne: user.id },
        }).because('У вас нет прав на управление этим счетом');
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'У вас нет прав на редактирование других пользователей.',
        );
        cannot(Action.ManageAccess, User).because('Необходимы права администратора');
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
        }).because('У вас нет прав на просмотр этой заявки.');
        cannot([Action.Update], Client, { id: { $ne: user.client?.id } }).because(
          'У вас нет прав на обновление других клиентов.',
        );
        cannot([Action.Read], Client, { id: { $ne: user.client?.id } }).because(
          'У вас нет прав на просмотр других клиентов.',
        );
        cannot(Action.Update, User, { id: { $ne: user.id } }).because(
          'У вас нет прав на обновление других пользователей.',
        );
        cannot(Action.ManageAccess, User).because('Вы не администратор');
        break;
      }
    }

    return build({
      detectSubjectType: (subject) => subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
