import { SetMetadata } from '@nestjs/common';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { Action } from './actions.enum';
import { Subjects } from './casl-ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check-ability';

export const CheckAbilities = (...requirements) =>
  SetMetadata(CHECK_ABILITY, requirements);

// export class ReadAccessoryAbility implements RequiredRule {
//   action: Action.Read;
//   subject = Accessory;
// }
