import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Request } from 'src/request/entities/request.entity';
import { Schedule } from './entities/schedule.entity';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Brigadier, Request]), AbilityModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
