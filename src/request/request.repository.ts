import { Injectable } from '@nestjs/common';
import { Client } from '../client/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { Stage } from '../stage/entities/stage.entity';
import { Tool } from '../tool/entities/tool.entity';
import { DataSource, Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { RequestEquipment } from './entities/request-equipment.entity';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestRepository extends Repository<Request> {
  constructor(private dataSource: DataSource) {
    super(Request, dataSource.createEntityManager());
  }

  async getFullRequest() {
    return this.dataSource
      .createQueryBuilder()
      .select('request')
      .from(Request, 'request')
      .leftJoinAndMapOne('address', Address, 'address', 'request.addressId = address.id')
      .leftJoinAndMapOne('client', Client, 'client', 'request.clientId = client.id')
      .leftJoinAndMapOne('stage', Stage, 'stage', 'request.stageId = stage.id')
      .leftJoinAndMapOne('tool', Tool, 'tool', 'tool.stageId = stage.id')
      .leftJoinAndMapOne(
        'request_equipment',
        RequestEquipment,
        'request_equipment',
        'request_equipment.requestId = request_equipment.id',
      )
      .leftJoinAndMapOne('equipment', Equipment, 'equipment', 'equipment.id = request_equipment.equipmentId')
      .getRawOne();
  }
}
