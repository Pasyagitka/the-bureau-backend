import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from '../ability/ability.module';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Client } from '../client/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { RequestReport } from '../request-report/entities/request-report.entity';
import { ScheduleModule } from '../schedule/schedule.module';
import { Stage } from '../stage/entities/stage.entity';
import { Address } from './entities/address.entity';
import { RequestEquipment } from './entities/request-equipment.entity';
import { Request } from './entities/request.entity';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestSubscriber } from './subscribers/request.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, Address, RequestReport, Equipment, Client, RequestEquipment, Stage, Brigadier]),
    AbilityModule,
    ScheduleModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestSubscriber],
})
export class RequestModule {}
