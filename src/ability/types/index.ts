import { Ability, InferSubjects } from '@casl/ability';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Tool } from 'src/tool/entities/tool.entity';
import { User } from 'src/user/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

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

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}
