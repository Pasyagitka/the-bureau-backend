import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Report } from './entities/report.entity';
import { RequestAccessory } from './entities/request-accessory.entity';
import { RequestEquipment } from './entities/request-equipment.entity';
import { RequestTool } from './entities/request-tool.entity';
import { Request } from './entities/request.entity';
import { AbilityModule } from 'src/ability/ability.module';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Client } from 'src/client/entities/client.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { RequestSubscriber } from './subscribers/request.subscriber';
import { Stage } from 'src/stage/entities/stage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      Address,
      Report,
      Equipment,
      Client,
      RequestAccessory,
      RequestEquipment,
      RequestTool,
      Stage,
      Brigadier,
    ]),
    AbilityModule,
    ScheduleModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestSubscriber],
})
export class RequestModule {}
