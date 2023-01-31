import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from '../ability/ability.module';
import { Request } from '../request/entities/request.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Tool } from '../tool/entities/tool.entity';
import { User } from '../user/entities/user.entity';
import { BrigadierController } from './brigadier.controller';
import { BrigadierService } from './brigadier.service';
import { Brigadier } from './entities/brigadier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Brigadier, Tool, Request, Schedule]), AbilityModule],
  controllers: [BrigadierController],
  providers: [BrigadierService],
})
export class BrigadierModule {}
