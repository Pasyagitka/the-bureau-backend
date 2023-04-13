import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../request/entities/request.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Client } from '../client/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Brigadier, Client])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
