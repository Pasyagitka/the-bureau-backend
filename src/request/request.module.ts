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
import { RequestController } from './controllers/request.controller';
import { RequestRepository } from './request.repository';
import { RequestService } from './services/request.service';
import { RequestSubscriber } from './subscribers/request.subscriber';
import { RequestBid } from './entities/request-bid.entity';
import { RequestScheduleController } from './controllers/request-schedule.controller';
import { RequestBidController } from './controllers/request-bid.controller';
import { RequestBidService } from './services/request-bid.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      Address,
      RequestReport,
      Equipment,
      Client,
      RequestEquipment,
      Stage,
      Brigadier,
      RequestBid,
    ]),
    AbilityModule,
    ScheduleModule,
  ],
  controllers: [RequestController, RequestScheduleController, RequestBidController],
  providers: [RequestService, RequestBidService, RequestSubscriber, RequestRepository],
})
export class RequestModule {}
