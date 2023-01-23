import { registerAs } from '@nestjs/config';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { BrigadierTool } from 'src/brigadier/entities/brigadier-tool.entity';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Address } from 'src/request/entities/address.entity';
import { Report } from 'src/request/entities/report.entity';
import { RequestAccessory } from 'src/request/entities/request-accessory.entity';
import { RequestEquipment } from 'src/request/entities/request-equipment.entity';
import { RequestTool } from 'src/request/entities/request-tool.entity';
import { Request } from 'src/request/entities/request.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Tool } from 'src/tool/entities/tool.entity';
import { User } from 'src/user/entities/user.entity';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [
      Equipment,
      Accessory,
      User,
      Client,
      Address,
      Stage,
      Tool,
      Brigadier,
      BrigadierTool,
      Request,
      RequestAccessory,
      RequestEquipment,
      RequestTool,
      Report,
      Schedule,
    ], //TODO add migrations
  };
});
