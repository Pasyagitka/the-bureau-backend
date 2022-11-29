import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { Role } from 'src/auth/enum/role.enum';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Request } from 'src/request/entities/request.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Tool } from 'src/tool/entities/tool.entity';
import { User } from 'src/user/entities/user.entity';
import { Action } from './actions.enum';

export type Subjects = InferSubjects<
  Accessory | Equipment | Brigadier | Client | Request | Schedule | Tool | User
>;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const builder = new AbilityBuilder(Ability);

    //todo define rules
    console.log('CaslAbilityFactory', user);
    switch (user.role) {
      case Role.Admin: {
        builder.can(Action.Manage, 'all'); //read-write access to everything
        break;
      }
      case Role.Brigadier: {
        builder.can(Action.Manage, 'all'); // read-only access to everything
        break;
      }
      default: {
        builder.can(Action.Manage, 'all'); // read-only access to everything
        break;
      }
    }

    return builder.build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
