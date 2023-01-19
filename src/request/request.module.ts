import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { RequestReport } from 'src/request-report/entities/request-report.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Stage } from 'src/stage/entities/stage.entity';
import { Address } from './entities/address.entity';
import { RequestAccessory } from './entities/request-accessory.entity';
import { RequestEquipment } from './entities/request-equipment.entity';
import { RequestTool } from './entities/request-tool.entity';
import { Request } from './entities/request.entity';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestSubscriber } from './subscribers/request.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      Address,
      RequestReport,
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
