import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Report } from './entities/report.entity';
import { RequestAccessory } from './entities/request-accessory.entity';
import { RequestEquipment } from './entities/request-equipment.entity';
import { RequestTool } from './entities/request-tool.entity';
import { Stage } from './entities/stage.entity';
import { Status } from './entities/status.entity';
import { Request } from './entities/request.entity';

@Module({
  // imports: [
  //   TypeOrmModule.forFeature([
  //     Request,
  //     Address,
  //     Report,
  //     RequestAccessory,
  //     RequestEquipment,
  //     RequestTool,
  //     Stage,
  //     Status,
  //   ]),
  // ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}