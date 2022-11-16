import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { Role } from 'src/auth/role.enum';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Request } from 'src/request/entities/request.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Tool } from 'src/tool/entities/tool.entity';
import { User } from 'src/user/entities/user.entity';
import { Action } from './actions.enum';

export type Subjects =
  | InferSubjects<
      | typeof Accessory
      | typeof Equipment
      | typeof Brigadier
      | typeof Client
      | typeof Request
      | typeof Schedule
      | typeof Tool
      | typeof User
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const builder = new AbilityBuilder(Ability);

    console.log('CaslAbilityFactory', user);
    switch (user.role) {
      case Role.Admin: {
        builder.can(Action.Manage, 'all'); //read-write access to everything
      }
      case Role.Brigadier: {
        builder.can(Action.Read, 'all'); // read-only access to everything
      }
      default: {
        builder.can(Action.Read, 'all'); // read-only access to everything
      }
    }

    return builder.build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
