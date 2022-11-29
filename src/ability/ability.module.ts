import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { policies } from './policies';
import { aclProviders } from './providers';

@Module({
  providers: [AbilityFactory, ...aclProviders],
  exports: [AbilityFactory, ...policies],
})
export class AbilityModule {}
