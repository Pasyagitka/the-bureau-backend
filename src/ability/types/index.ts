import { Ability, InferSubjects } from '@casl/ability';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { RequestReport } from '../../request-report/entities/request-report.entity';
import { Accessory } from '../../accessory/entities/accessory.entity';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { Client } from '../../client/entities/client.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { Request } from '../../request/entities/request.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Stage } from '../../stage/entities/stage.entity';
import { Tool } from '../../tool/entities/tool.entity';
import { User } from '../../user/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  ManageAccess = 'manageaccess',
}

export type Subjects =
  | InferSubjects<
      | typeof Accessory
      | typeof Equipment
      | typeof Brigadier
      | typeof Client
      | typeof Request
      | typeof RequestReport
      | typeof Schedule
      | typeof Tool
      | typeof User
      | typeof Stage
      | typeof Invoice
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}
