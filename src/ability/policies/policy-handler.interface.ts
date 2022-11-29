import { AppAbility } from '../types';

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}
