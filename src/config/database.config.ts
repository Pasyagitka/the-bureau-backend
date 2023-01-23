import { registerAs } from '@nestjs/config';
import { Accessory } from '../accessory/entities/accessory.entity';
import { BrigadierTool } from '../brigadier/entities/brigadier-tool.entity';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Client } from '../client/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { Rental } from '../rental/entities/rental.entity';
import { RequestReport } from '../request-report/entities/request-report.entity';
import { Address } from '../request/entities/address.entity';
import { RequestEquipment } from '../request/entities/request-equipment.entity';
import { Request } from '../request/entities/request.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Stage } from '../stage/entities/stage.entity';
import { Tool } from '../tool/entities/tool.entity';
import { User } from '../user/entities/user.entity';

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
      Accessory,
      Address,
      Brigadier,
      BrigadierTool,
      Equipment,
      Client,
      Stage,
      Tool,
      Request,
      RequestEquipment,
      Rental,
      RequestReport,
      Schedule,
      User,
    ], //TODO add migrations
    // migrations: ['src/migrations/*{.ts,.js}'],
    // cli: {
    //   migrationsDir: 'src/migrations',
    // },
  };
});
